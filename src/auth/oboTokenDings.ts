import * as openIdClient from 'openid-client';
import { TokenEndpointResponse } from 'openid-client';
import { logger } from '@navikt/next-logger';

export interface ExchangeToken {
    (token: string, targetApp: string): Promise<TokenEndpointResponse>;
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

const createNbf = (): number => {
    return Math.floor(Date.now() / 1000);
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

let _config = null;
async function getConfig(): Promise<openIdClient.Configuration> {
    if (_config) {
        return _config;
    }

    const { clientId, discoveryUrl, privateJwk } = getAzureAdOptions();
    _config = await openIdClient.discovery(new URL(discoveryUrl), clientId, privateJwk);
    return _config;
}

const createOboTokenDings = async (): Promise<OboAuth> => {
    return {
        async getOboToken(accessToken, scope) {
            try {
                logger.info(`Starter obo-utveksling for ${scope}`);
                const config = await getConfig();
                const response = await openIdClient.genericGrantRequest(
                    config,
                    'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    {
                        requested_token_use: 'on_behalf_of',
                        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                        scope,
                        assertion: accessToken,
                        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                        subject_token: accessToken,
                        audience: scope,
                    },
                    // {
                    //     clientAssertionPayload: {
                    //         aud: config.serverMetadata().token_endpoint,
                    //         nbf: createNbf(),
                    //     },
                    // },
                );
                // return client.grant(
                //     {
                //         grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                //         client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                //         requested_token_use: 'on_behalf_of',
                //         scope,
                //         assertion: accessToken,
                //         subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                //         subject_token: accessToken,
                //         audience: scope,
                //     },
                //     {
                //         clientAssertionPayload: {
                //             aud: client.issuer.metadata.token_endpoint,
                //             nbf: createNbf(),
                //         },
                //     },
                // );
                logger.info({ response, msg: 'Token obo-utveklsing ferdig' });
                return response;
            } catch (err: unknown) {
                logger.error({ err, msg: `Feil ved generering av OBO-token: ${err}` });
                return Promise.reject(err);
            }
        },
    };
};

export default createOboTokenDings;
