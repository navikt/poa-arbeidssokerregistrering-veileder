import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { logger } from '@navikt/next-logger';

import { getHeaders, getModiacontextholderToken } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

const url = `${process.env.MODIACONTEXTHOLDER_URL}`;
const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

const hentModiaContext = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const callId = nanoid();

    try {
        const headers = brukerMock
            ? getHeaders('token', callId)
            : getHeaders(await getModiacontextholderToken(req), callId);
        logger.info(`Starter kall callId: ${callId} mot ${url}`);
        const result = await fetch(`${url}`, {
            headers,
        }).then((res) => res.json());
        res.json(result);
    } catch (error) {
        logger.error(`Kall med (callId: ${callId}) feilet. Feilmelding: ${error}`);
        res.status(500).end(`${error}`);
    }
};

export default withAuthenticatedApi(hentModiaContext);