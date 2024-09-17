import { NextApiHandler, NextApiRequest } from 'next';
import { nanoid } from 'nanoid';
import { logger } from '@navikt/next-logger';

import createOboTokenDings, { OboAuth } from '../auth/oboTokenDings';

export const getHeaders = (token: string, callId: string) => {
    return {
        'Nav-Consumer-Id': 'arbeidssokerregistrering-for-veileder',
        'Nav-Call-Id': callId,
        'x-trace-id': callId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

export const getTraceIdFromRequest = (req: NextApiRequest) => (req.headers['x-trace-id'] as string) ?? nanoid();

export interface ApiError extends Error {
    status?: number;
    traceId?: string;
}

let _oboTokenDings: OboAuth | undefined;
const getOboTokenDings = async (): Promise<OboAuth> => {
    if (!_oboTokenDings) {
        _oboTokenDings = await createOboTokenDings();
    }

    return _oboTokenDings;
};

const ARBEIDSSOEKERREGISTRERING_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssokerregisteret-api-inngang/.default`;
const OPPSLAGSAPI_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag/.default`;
const MODIACONTEXTHOLDER_SCOPE = `api://${process.env.MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID}/.default`;
const VEILARBOPPFOLGING_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME.replace(
    'gcp',
    'fss',
)}.pto.veilarboppfolging/.default`;
const VEILARBDIALOG_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.dab.veilarbdialog/.default`;
const VEILARBPERSON_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME.replace('gcp', 'fss')}.pto.veilarbperson/.default`;
const VEILARBVEILEDER_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME.replace(
    'gcp',
    'fss',
)}.pto.veilarbveileder/.default`;
const OBO_UNLEASH_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.obo.obo-unleash/.default`;
const AAREG_API_SCOPE = `api://${process.env.AAREG_CLUSTER}.arbeidsforhold.${process.env.AAREG_APPNAME}/.default`;
const PAW_ARBEIDSSOKER_BESVARELSE_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoker-besvarelse/.default`;

export const getArbeidssoekerregistreringToken = async (req: NextApiRequest) => {
    const tokenSet = await (
        await getOboTokenDings()
    ).getOboToken(getTokenFromRequest(req)!, ARBEIDSSOEKERREGISTRERING_SCOPE);
    return tokenSet.access_token!;
};

export const getOppslagsAPIToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, OPPSLAGSAPI_SCOPE);
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

export const getAaregToken = async (req: NextApiRequest) => {
    const tokenSet = await (await getOboTokenDings()).getOboToken(getTokenFromRequest(req)!, AAREG_API_SCOPE);
    return tokenSet.access_token!;
};

export const getTokenFromRequest = (req: NextApiRequest) => {
    const bearerToken = req.headers['authorization'];
    return bearerToken?.replace('Bearer ', '');
};

export const getPawArbeidssokerBesvarelseToken = async (req: NextApiRequest) => {
    const tokenSet = await (
        await getOboTokenDings()
    ).getOboToken(getTokenFromRequest(req)!, PAW_ARBEIDSSOKER_BESVARELSE_SCOPE);
    return tokenSet.access_token!;
};

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

export type ApiHandlerOpts = {
    method: 'PUT' | 'POST' | 'GET' | 'DELETE';
    body?: Record<string, string>;
};

export type LagApiHandlerKall = (
    url: string,
    getToken: (req: NextApiRequest) => Promise<string>,
    opts: ApiHandlerOpts,
) => NextApiHandler;
const lagApiHandlerMedAuthHeaders: LagApiHandlerKall = (url, getToken, opts) => async (req, res) => {
    const callId = getTraceIdFromRequest(req);
    try {
        const body = {
            ...(opts.body ?? {}),
            ...(req.body ?? {}), // OBS: krever at innkommende request har satt Content-type: application/json
        };

        const respons = await fetch(url, {
            method: opts.method,
            body: JSON.stringify({
                ...body,
            }),
            headers: brukerMock ? getHeaders('token', callId) : getHeaders(await getToken(req), callId),
        }).then(async (apiResponse) => {
            const contentType = apiResponse.headers.get('content-type');
            const isJsonResponse = contentType && contentType.includes('application/json');
            const traceId = apiResponse.headers.get('x-trace-id');
            if (!apiResponse.ok) {
                logger.warn(`apiResponse ikke ok (${apiResponse.status}), callId - ${callId}, x-trace-id: ${traceId}`);
                if (isJsonResponse) {
                    const data = await apiResponse.json();
                    return {
                        ...data,
                        status: apiResponse.status,
                        traceId: traceId,
                    };
                } else {
                    const error = new Error(apiResponse.statusText) as ApiError;
                    error.status = apiResponse.status;
                    error.traceId = traceId;
                    throw error;
                }
            }

            if (isJsonResponse) {
                return apiResponse.json();
            } else if (apiResponse.status === 204) {
                return {
                    status: 204,
                };
            }
        });

        logger.info(
            `Kall callId: ${callId} mot ${url} er ferdig (${respons?.status || 200}) traceID: ${respons?.traceId}`,
        );

        if (respons?.status === 204) {
            res.status(204).end();
        } else if (respons?.status && respons?.status !== 200) {
            res.status(respons.status).json(respons);
        } else {
            res.json(respons ?? {});
        }
    } catch (error) {
        logger.error(`Kall mot ${url} (callId: ${callId}, traceId: ${error.traceId}) feilet. Feilmelding: ${error}`);
        res.status((error as ApiError).status || 500).end();
    }
};

export default lagApiHandlerMedAuthHeaders;
