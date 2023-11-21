import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import resolveDynamicUrl from './resolve-dynamic-url';

type getHeaders = (req: NextApiRequest, callId?: string) => Promise<Record<string, string>>;
export const createProxyCall = (getHeaders: getHeaders, url: string) => {
    return async (req: NextApiRequest, res: NextApiResponse<any>) => {
        const callId = nanoid();
        const { slug, ...query } = req.query;
        try {
            const resolvedUrl = resolveDynamicUrl(url, slug, query);
            logger.info(`Starter ${req.method}-kall med callId: ${callId} mot ${resolvedUrl}`);

            const result = await fetch(resolvedUrl, {
                method: req.method,
                body: req.method === 'POST' ? JSON.stringify(req.body) : null,
                headers: await getHeaders(req, callId),
            }).then((response) => {
                if (!response.ok) {
                    const e = new Error(response.statusText);
                    (e as any).status = response.status;
                    throw e;
                }

                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                }

                return null;
            });

            res.json(result);
        } catch (error) {
            logger.error(`Kall med (callId: ${callId}) feilet. Feilmelding: ${error}`);
            const status = error.status || 500;
            res.status(status).end(`${error.message}`);
        }
    };
};
