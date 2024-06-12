import { ApiError, getArbeidssoekerregistreringToken, getHeaders, getTraceIdFromRequest } from './next-api-handler';
import { logger } from '@navikt/next-logger';
import { NextApiHandler } from 'next';
import { trace } from '@opentelemetry/api';

const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

type Opts = {
    method: 'PUT' | 'POST' | 'GET' | 'DELETE';
    body?: Record<string, string>;
};

type LagArbeidssokerApiKall = (url: string, opts: Opts) => NextApiHandler;
const lagArbeidssokerApiKall: LagArbeidssokerApiKall = (url, opts) => async (req, res) => {
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
            headers: brukerMock
                ? getHeaders('token', callId)
                : getHeaders(await getArbeidssoekerregistreringToken(req), callId),
        }).then(async (apiResponse) => {
            const contentType = apiResponse.headers.get('content-type');
            const isJsonResponse = contentType && contentType.includes('application/json');
            const traceId = apiResponse.headers.get('x-trace-id');
            logger.info('x-trace-id: ' + traceId);
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
        res.setHeader('x-trace-id', error.traceId)
            .status((error as ApiError).status || 500)
            .end();
    }
};

export default lagArbeidssokerApiKall;
