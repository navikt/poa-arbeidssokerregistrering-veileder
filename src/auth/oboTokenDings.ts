import * as openIdClient from 'openid-client';
import { TokenEndpointResponse } from 'openid-client';
import { logger } from '@navikt/next-logger';

export interface ExchangeToken {
    (token: string, targetApp: string): Promise<TokenEndpointResponse>;
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
    const clientSecret = assert(process.env.AZURE_APP_CLIENT_SECRET, 'AZURE_APP_CLIENT_SECRET is missing');

    return {
        clientId,
        discoveryUrl,
        clientSecret,
    };
};
export interface OboAuth {
    getOboToken: ExchangeToken;
}

let _config = null;
async function getConfig(): Promise<openIdClient.Configuration> {
    if (_config) {
        return _config;
    }

    const { clientId, discoveryUrl, clientSecret } = getAzureAdOptions();
    _config = await openIdClient.discovery(new URL(discoveryUrl), clientId, clientSecret);
    return _config;
}

const createOboTokenDings = async (): Promise<OboAuth> => {
    return {
        async getOboToken(accessToken, scope) {
            try {
                const config = await getConfig();
                return await openIdClient.genericGrantRequest(config, 'urn:ietf:params:oauth:grant-type:jwt-bearer', {
                    requested_token_use: 'on_behalf_of',
                    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
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
