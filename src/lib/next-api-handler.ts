import { NextApiHandler, NextApiRequest } from 'next';
import { nanoid } from 'nanoid';
import { logger } from '@navikt/next-logger';

import createOboTokenDings, { OboAuth } from '../auth/oboTokenDings';
import queryToString from './query-to-string';

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

let _oboTokenDings: OboAuth | undefined;
const getOboTokenDings = async (): Promise<OboAuth> => {
    if (!_oboTokenDings) {
        _oboTokenDings = await createOboTokenDings();
    }

    return _oboTokenDings;
};

const VEILARBREGISTRERING_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.veilarbregistrering/.default`;
const MODIACONTEXTHOLDER_SCOPE = `api://${process.env.MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID}/.default`;
const VEILARBOPPFOLGING_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME.replace(
    'gcp',
    'fss',
)}.pto.veilarboppfolging/.default`;
const VEILARBDIALOG_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME.replace('gcp', 'fss')}.pto.veilarbdialog/.default`;
const VEILARBPERSON_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME.replace('gcp', 'fss')}.pto.veilarbperson/.default`;
const VEILARBVEILEDER_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME.replace(
    'gcp',
    'fss',
)}.pto.veilarbveileder/.default`;
const PAW_PROXY_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME.replace('gcp', 'fss')}.paw.paw-proxy/.default`;
const OBO_UNLEASH_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.obo.obo-unleash/.default`;
export const getVeilarbregistreringToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, VEILARBREGISTRERING_SCOPE);
    return tokenSet.access_token!;
};

export const getModiacontextholderToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, MODIACONTEXTHOLDER_SCOPE);
    return tokenSet.access_token!;
};

export const getVeilarboppfolgingToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, VEILARBOPPFOLGING_SCOPE);
    return tokenSet.access_token!;
};

export const getVeilarbdialogToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, VEILARBDIALOG_SCOPE);
    return tokenSet.access_token!;
};

export const getVeilarbpersonToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, VEILARBPERSON_SCOPE);
    return tokenSet.access_token!;
};

export const getVeilarbveilederToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, VEILARBVEILEDER_SCOPE);
    return tokenSet.access_token!;
};

export const getOboUnleashToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, OBO_UNLEASH_SCOPE);
    return tokenSet.access_token!;
};

export const getPawProxyToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, PAW_PROXY_SCOPE);
    return tokenSet.access_token!;
};

export const getTokenFromRequest = (req: NextApiRequest) => {
    const bearerToken = req.headers['authorization'];
    return bearerToken?.replace('Bearer ', '');
};

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const lagApiHandlerMedAuthHeaders: (url: string, errorHandler?: (response: Response) => void) => NextApiHandler =
    (url: string, errorHandler) => async (req, res) => {
        const callId = nanoid();
        let body = null;

        if (req.method === 'POST') {
            body = req.body;
        }
        try {
            logger.info(`Starter kall callId: ${callId} mot ${url}`);
            const urlMedQuery = `${url}${queryToString(req.query)}`;
            const response = await fetch(urlMedQuery, {
                method: req.method,
                body,
                headers: brukerMock
                    ? getHeaders('token', callId)
                    : getHeaders(await getVeilarbregistreringToken(req), callId),
            }).then(async (apiResponse) => {
                logger.info(`Kall callId: ${callId} mot ${url} er ferdig`);
                const contentType = apiResponse.headers.get('content-type');
                const statusCode = apiResponse.status;

                if (statusCode === 204) {
                    return apiResponse;
                }

                if (!apiResponse.ok) {
                    logger.warn(`apiResponse ikke ok, contentType: ${contentType}, callId - ${callId}`);
                    if (statusCode === 400) {
                        logger.error({ body, msg: `Bad request for callId ${callId}` });
                    }

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
