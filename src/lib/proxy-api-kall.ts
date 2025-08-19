import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@navikt/next-logger';

import resolveDynamicUrl from './resolve-dynamic-url';
import { getTraceIdFromRequest } from './next-api-handler';

type getHeaders = (req: NextApiRequest, callId?: string) => Promise<Record<string, string>>;

async function toError(response: Response) {
    const e = new Error(response.statusText);
    (e as any).status = response.status;
    try {
        e.message = await response.text();
    } catch (err) {} // ignore
    return e;
}

export const createProxyCall = (getHeaders: getHeaders, url: string) => {
    return async (req: NextApiRequest, res: NextApiResponse<any>) => {
        const callId = getTraceIdFromRequest(req);
        const { slug, ...query } = req.query;
        try {
            const resolvedUrl = resolveDynamicUrl(url, slug, query);
            logger.info(`Starter ${req.method}-kall [${slug}] mot ${resolvedUrl}`);

            const result = await fetch(resolvedUrl, {
                method: req.method,
                body: req.method === 'POST' ? JSON.stringify(req.body) : null,
                headers: await getHeaders(req, callId),
            }).then(async (response) => {
                if (!response.ok) {
                    throw await toError(response);
                }

                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                }

                return null;
            });

            res.json(result);
        } catch (error) {
            logger.warn(error, `Kall mot ${url} [${slug}] feilet ${error.status}`);
            const status = error.status || 500;
            res.setHeader('x-trace-id', callId).status(status).end();
        }
    };
};
