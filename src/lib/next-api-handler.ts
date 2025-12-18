import { NextApiHandler, NextApiRequest } from 'next';
import { nanoid } from 'nanoid';
import { logger } from '@navikt/next-logger';
import { requestAzureOboToken } from '@navikt/oasis';

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

interface ApiError extends Error {
    status?: number;
    traceId?: string;
}

const getOboToken = async (accessToken: string, scope: string): Promise<string> => {
    const result = await requestAzureOboToken(accessToken, scope);

    if (result.ok === false) {
        logger.error(result.error, `Obo tokenutveksling mot ${scope} feilet`);
        throw result.error;
    }

    return result.token;
};

const ARBEIDSSOEKERREGISTRERING_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssokerregisteret-api-inngang/.default`;
const OPPSLAGSAPI_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag/.default`;
const OPPSLAGSAPI_V2_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag-v2/.default`;
const BEKREFTELSE_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-bekreftelse/.default`;
const MODIACONTEXTHOLDER_SCOPE = `api://${process.env.MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID}/.default`;
const VEILARBOPPFOLGING_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.poao.veilarboppfolging/.default`;
const VEILARBDIALOG_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.dab.veilarbdialog/.default`;
const VEILARBPERSON_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.obo.veilarbperson/.default`;
const VEILARBVEILEDER_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.obo.veilarbveileder/.default`;
const OBO_UNLEASH_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.obo.obo-unleash/.default`;
const AAREG_API_SCOPE = `api://${process.env.AAREG_CLUSTER}.arbeidsforhold.${process.env.AAREG_APPNAME}/.default`;
const PAW_ARBEIDSSOKER_BESVARELSE_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoker-besvarelse/.default`;
const AIA_BACKEND_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.aia-backend/.default`;

export const getArbeidssoekerregistreringToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, ARBEIDSSOEKERREGISTRERING_SCOPE);
};

export const getOppslagsAPIToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, OPPSLAGSAPI_SCOPE);
};

export const getOppslagsAPIV2Token = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, OPPSLAGSAPI_V2_SCOPE);
};

export const getBekreftelseAPIToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, BEKREFTELSE_API_SCOPE);
};

export const getModiacontextholderToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, MODIACONTEXTHOLDER_SCOPE);
};

export const getVeilarboppfolgingToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, VEILARBOPPFOLGING_SCOPE);
};

export const getVeilarbdialogToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, VEILARBDIALOG_SCOPE);
};

export const getVeilarbpersonToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, VEILARBPERSON_SCOPE);
};

export const getVeilarbveilederToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, VEILARBVEILEDER_SCOPE);
};

export const getOboUnleashToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, OBO_UNLEASH_SCOPE);
};

export const getAaregToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, AAREG_API_SCOPE);
};

const getTokenFromRequest = (req: NextApiRequest) => {
    const bearerToken = req.headers['authorization'];
    return bearerToken?.replace('Bearer ', '');
};

export const getPawArbeidssokerBesvarelseToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, PAW_ARBEIDSSOKER_BESVARELSE_SCOPE);
};

export const getAiaBackendAzureToken = async (req: NextApiRequest) => {
    return getOboToken(getTokenFromRequest(req)!, AIA_BACKEND_SCOPE);
};

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

export type ApiHandlerOpts = {
    method: 'PUT' | 'POST' | 'GET' | 'DELETE';
    body?: Record<string, string>;
};

type LagApiHandlerKall = (
    url: string,
    getToken: (req: NextApiRequest) => Promise<string>,
    opts?: ApiHandlerOpts,
) => NextApiHandler;
const lagApiHandlerMedAuthHeaders: LagApiHandlerKall = (url, getToken, opts) => async (req, res) => {
    const callId = getTraceIdFromRequest(req);
    try {
        const body = {
            ...(opts?.body ?? {}),
            ...(req.body ?? {}), // OBS: krever at innkommende request har satt Content-type: application/json
        };
        const params = new URLSearchParams(req.query as Record<string, string>).toString();
        const queryParams = params.length === 0 ? '' : `?${params}`;
        const method = opts?.method ?? 'GET';

        const respons = await fetch(`${url}${queryParams}`, {
            method,
            body: ['GET', 'HEAD'].includes(method)
                ? null
                : JSON.stringify({
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
