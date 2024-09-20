import type { NextApiRequest, NextApiResponse } from 'next';

export const featureMocks = {
    version: 1,
    features: [
        {
            name: 'arbeidssokerregistrering.bruk-pam-ontologi',
            type: 'release',
            enabled: false,
            stale: false,
            strategies: [
                {
                    name: 'default',
                    parameters: {},
                },
            ],
            variants: [],
        },
        {
            name: 'arbeidssoekerregistrering.vis-bekreftelse',
            type: 'release',
            enabled: true,
            stale: false,
            strategies: [
                {
                    name: 'default',
                    parameters: {},
                },
            ],
            variants: [],
        },
        {
            name: 'arbeidssoekerregistrering.bruk-v2-inngang',
            type: 'release',
            enabled: false,
            stale: false,
            strategies: [
                {
                    name: 'default',
                    parameters: {},
                },
            ],
            variants: [],
        },
        {
            name: 'arbeidssoekerregistrering.vedlikehold',
            type: 'release',
            enabled: false,
            stale: false,
            strategies: [
                {
                    name: 'default',
                    parameters: {},
                },
            ],
            variants: [],
        },
        {
            name: 'arbeidssokerregistrering-for-veileder.vis-hva-er-nytt',
            type: 'release',
            enabled: true,
            stale: false,
            strategies: [
                {
                    name: 'default',
                    parameters: {},
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
