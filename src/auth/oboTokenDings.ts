import { Issuer, TokenSet } from 'openid-client';
import { logger } from '@navikt/next-logger';

export interface ExchangeToken {
    (token: string, targetApp: string): Promise<TokenSet>;
}

export interface JWKS {
    keys: [
        {
            kty: 'oct';
        },
    ];
}

const assert = <T extends any>(value: T | undefined | null, msg?: string): T => {
    if (!value) {
        throw new Error(msg || 'Value is missing');
    }

    return value;
};

const getAzureAdOptions = () => {
    const clientId = assert(process.env.AZURE_APP_CLIENT_ID, 'AZURE_APP_CLIENT_ID is missing');
    const discoveryUrl = assert(process.env.AZURE_APP_WELL_KNOWN_URL, 'AZURE_APP_WELL_KNOWN_URL is missing');
    const privateJwk = assert(process.env.AZURE_APP_JWK, 'AZURE_APP_JWK is missing');

    return {
        clientId,
        discoveryUrl,
        privateJwk,
    };
};
export interface OboAuth {
    getOboToken: ExchangeToken;
}

export const createJWKS = (jwkJson: string): JWKS => {
    const jwk = JSON.parse(jwkJson);

    // UnhandledPromiseRejectionWarning: JWKInvalid: `x5c` member at index 0 is not a valid base64-encoded DER PKIX certificate
    delete jwk.x5c;

    return {
        keys: [jwk],
    };
};

const createOboTokenDings = async (): Promise<OboAuth> => {
    const { clientId, discoveryUrl, privateJwk } = getAzureAdOptions();
    const issuer = await Issuer.discover(discoveryUrl);
    const client = new issuer.Client(
        {
            client_id: clientId,
            token_endpoint_auth_method: 'private_key_jwt',
            token_endpoint_auth_signing_alg: 'RS256',
            response_types: ['code'],
        },
        createJWKS(privateJwk),
    );

    return {
        async getOboToken(accessToken, scope) {
            try {
                return client.grant({
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                    requested_token_use: 'on_behalf_of',
                    scope,
                    assertion: accessToken,
                    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                    subject_token: accessToken,
                    audience: scope,
                });
            } catch (err: unknown) {
                logger.error(err, `Feil ved generering av OBO-token: ${err}`);
                return Promise.reject(err);
            }
        },
    };
};

export default createOboTokenDings;
