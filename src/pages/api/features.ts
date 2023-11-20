import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@navikt/next-logger';
import { getDefinitions } from '@unleash/nextjs';
import { featureMocks } from './mocks/features';

async function features(req: NextApiRequest, res: NextApiResponse) {
    const brukerMock = process.env.ENABLE_MOCK === 'enabled';
    try {
        const definitions = brukerMock ? featureMocks : await getDefinitions();
        return res.status(200).json(definitions.features || []);
    } catch (error) {
        logger.error(error);
        return res.status(200).json([]);
    }
}

export default features;
