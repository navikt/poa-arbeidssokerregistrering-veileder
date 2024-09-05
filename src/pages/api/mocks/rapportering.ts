import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@navikt/next-logger';

const rapportering = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(400).end();
    }

    logger.info(req.body, 'POST /api/mocks/rapportering');
    res.status(200).json({});
};

export default rapportering;
