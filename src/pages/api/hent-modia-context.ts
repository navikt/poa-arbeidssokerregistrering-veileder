import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { logger } from '@navikt/next-logger';

import { getHeaders, getModiacontextholderToken } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

const url = `${process.env.MODIACONTEXTHOLDER_URL}/modiacontextholder/api/context/`;
const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

const resolveDynamicUrl = (url: string, slug?: string | string[]) => {
    if (!slug) {
        return url;
    }

    let path;
    if (Array.isArray(slug)) {
        path = slug.join('/');
    } else {
        path = slug;
    }

    return url.replace('[slug]', path);
};
export const lagModiaContextKall = (url: string) => {
    return async (req: NextApiRequest, res: NextApiResponse<any>) => {
        const callId = nanoid();
        const { slug } = req.query;

        try {
            const resolvedUrl = resolveDynamicUrl(url, slug);
            const headers = brukerMock
                ? getHeaders('token', callId)
                : getHeaders(await getModiacontextholderToken(req), callId);
            logger.info(`Starter ${req.method}-kall med callId: ${callId} mot ${resolvedUrl}`);
            const result = await fetch(resolvedUrl, {
                method: req.method,
                body: req.method === 'POST' ? JSON.stringify(req.body) : null,
                headers,
            }).then((response) => {
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                }

                return null;
            });
            res.json(result);
        } catch (error) {
            logger.error(`Kall med (callId: ${callId}) feilet. Feilmelding: ${error}`);
            res.status(500).end(`${error}`);
        }
    };
};

export default withAuthenticatedApi(lagModiaContextKall(url));
