import * as openIdClient from 'openid-client';
import { TokenEndpointResponse } from 'openid-client';
import jwt from 'jsonwebtoken';
import { JWK } from 'node-jose';
import { ulid } from 'ulid';
import { logger } from '@navikt/next-logger';

export interface ExchangeToken {
    (token: string, targetApp: string): Promise<TokenEndpointResponse>;
}

export interface TokenXAuth {
    exchangeIDPortenToken: ExchangeToken;
}

export interface TokenDingsOptions {
    tokenXWellKnownUrl: string;
    tokenXClientId: string;
    tokenXTokenEndpoint: string;
    tokenXPrivateJwk: string;
}

async function createClientAssertion(options: TokenDingsOptions): Promise<string> {
    const { tokenXPrivateJwk, tokenXClientId, tokenXTokenEndpoint } = options;

    const now = Math.floor(Date.now() / 1000);
    const key = await JWK.asKey(tokenXPrivateJwk);
    return jwt.sign(
        {
            sub: tokenXClientId,
            aud: tokenXTokenEndpoint,
            iss: tokenXClientId,
            exp: now + 60, // max 120
            iat: now,
            jti: ulid(),
            nbf: now,
        },
        key.toPEM(true),
        { algorithm: 'RS256' },
    );
}

let _config = null;
async function getConfig(options: TokenDingsOptions) {
    if (_config) {
        return _config;
    }
    const { tokenXWellKnownUrl, tokenXClientId } = options;
    _config = await openIdClient.discovery(new URL(tokenXWellKnownUrl), tokenXClientId);
    return _config;
}

const createTokenDings = async (options: TokenDingsOptions): Promise<TokenXAuth> => {
    return {
        async exchangeIDPortenToken(idPortenToken: string, targetApp: string) {
            try {
                const clientAssertion = await createClientAssertion(options);
                return openIdClient.genericGrantRequest(
                    await getConfig(options),
                    'urn:ietf:params:oauth:grant-type:token-exchange',
                    {
                        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
                        audience: targetApp,
                        client_assertion: clientAssertion,
                        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                        subject_token: idPortenToken,
                        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                        token_endpoint_auth_method: 'private_key_jwt',
                    },
                );
            } catch (err: unknown) {
                logger.error(`Feil under token exchange: ${err}`);
                return Promise.reject(err);
            }
        },
    };
};

export default createTokenDings;
