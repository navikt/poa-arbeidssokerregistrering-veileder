import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@navikt/next-logger';

const bekreftelse = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(400).end();
    }

    logger.info(req.body, 'POST /api/mocks/bekreftelse');
    res.status(200).json({});
    // res.status(500).json({
    //     id: 'e6ce05dd-1df2-42c9-b8d2-6da43506c559',
    //     code: 'PAW_UKJENT_FEIL',
    //     title: 'Internal Server Error',
    //     status: 500,
    //     detail: 'Forespørsel feilet med ukjent feil',
    //     instance: '/api/v1/bekreftelse',
    //     type: 'about:blank',
    //     timestamp: '2024-11-04T11:25:37.495768119Z',
    //     traceId: '361d03ef4e24fab3171f8363d969b8f9',
    // });
};

export default bekreftelse;
