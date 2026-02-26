import type { NextApiRequest, NextApiResponse } from 'next';

export const featureMocks = {
    version: 1,
    features: [
        {
            name: 'arbeidssokerregistrering-for-veileder.vis-hva-er-nytt',
            type: 'release',
            enabled: false,
            stale: false,
            strategies: [
                {
                    name: 'default',
                    parameters: {},
                    constraints: [],
                },
            ],
            variants: [],
        },
    ],
};

const featureToggles = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(200).json(featureMocks);
};

export default featureToggles;
