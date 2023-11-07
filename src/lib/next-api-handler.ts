import { NextApiHandler, NextApiRequest } from 'next';
import { nanoid } from 'nanoid';
import createTokenDings, { Auth } from '../auth/tokenDings';
import { logger } from '@navikt/next-logger';
import { TokenSet } from 'openid-client';

export const getHeaders = (token: string, callId: string) => {
    return {
        'Nav-Consumer-Id': 'arbeidssokerregistrering-for-veileder',
        'Nav-Call-Id': callId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

export const lagApiPostHandlerMedAuthHeaders: (
    url: string,
    errorHandler?: (response: Response) => void,
) => NextApiHandler = (url: string, errorHandler) => async (req, res) => {
    if (req.method === 'POST') {
        return lagApiHandlerMedAuthHeaders(url, errorHandler)(req, res);
    } else {
        res.status(405).end();
    }
};

export interface ApiError extends Error {
    status?: number;
}

let _tokenDings: Auth | undefined;
const getTokenDings = async (): Promise<Auth> => {
    if (!_tokenDings) {
        _tokenDings = await createTokenDings({
            tokenXWellKnownUrl: process.env.TOKEN_X_WELL_KNOWN_URL!,
            tokenXClientId: process.env.TOKEN_X_CLIENT_ID!,
            tokenXTokenEndpoint: process.env.TOKEN_X_TOKEN_ENDPOINT!,
            tokenXPrivateJwk: process.env.TOKEN_X_PRIVATE_JWK!,
        });
    }

    return _tokenDings;
};

const VEILARBREGISTRERING_CLIENT_ID = `${process.env.NAIS_CLUSTER_NAME}:paw:veilarbregistrering`;
const exchangeIDPortenToken = async (idPortenToken: string): Promise<TokenSet> => {
    return (await getTokenDings()).exchangeIDPortenToken(idPortenToken, VEILARBREGISTRERING_CLIENT_ID);
};

export const getTokenFromRequest = (req: NextApiRequest) => {
    const bearerToken = req.headers['authorization'];
    return bearerToken?.replace('Bearer ', '');
};

const lagApiHandlerMedAuthHeaders: (url: string, errorHandler?: (response: Response) => void) => NextApiHandler =
    (url: string, errorHandler) => async (req, res) => {
        const callId = nanoid();
        let body = null;

        if (req.method === 'POST') {
            body = req.body;
        }

        try {
            logger.info(`Starter kall callId: ${callId} mot ${url}`);
            const response = await fetch(url, {
                method: req.method,
                body,
                headers: getHeaders(getTokenFromRequest(req), callId),
            }).then(async (apiResponse) => {
                logger.info(`Kall callId: ${callId} mot ${url} er ferdig`);
                const contentType = apiResponse.headers.get('content-type');
                const statusCode = apiResponse.status;

                if (statusCode === 204) {
                    return apiResponse;
                }

                if (!apiResponse.ok) {
                    logger.error(`apiResponse ikke ok, contentType: ${contentType}, callId - ${callId}`);
                    if (typeof errorHandler === 'function') {
                        return errorHandler(apiResponse);
                    } else {
                        const error = new Error(apiResponse.statusText) as ApiError;
                        error.status = apiResponse.status;
                        throw error;
                    }
                }

                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError(
                        `Fikk ikke JSON fra ${url} (callId ${callId}). Body: ${await apiResponse.text()}.`,
                    );
                }

                return apiResponse.json();
            });

            return res.json(response);
        } catch (error) {
            logger.error(`Kall mot ${url} (callId: ${callId}) feilet. Feilmelding: ${error}`);
            res.status((error as ApiError).status || 500).end(`Noe gikk galt (callId: ${callId})`);
        }
    };

export default lagApiHandlerMedAuthHeaders;
