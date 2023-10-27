import type { NextApiRequest, NextApiResponse } from 'next';

const featureToggles = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(200).json({
        version: 1,
        features: [
            {
                name: 'arbeidssokerregistrering.fss.ny-ingress',
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
                name: 'arbeidssokerregistrering.eksperimenter.videresend-til-aia',
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
                name: 'arbeidssokerregistrering.ingen_kvittering',
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
                name: 'arbeidssokerregistrering.kontaktopplysninger',
                type: 'release',
                enabled: true,
                stale: false,
                strategies: [
                    {
                        name: 'default',
                    },
                ],
                variants: null,
            },
            {
                name: 'arbeidssokerregistrering.kunngjoring',
                type: 'release',
                enabled: false,
                stale: false,
                strategies: [
                    {
                        name: 'default',
                        parameters: {},
                    },
                ],
                variants: null,
            },
            {
                name: 'arbeidssokerregistrering.nedetid',
                type: 'release',
                enabled: false,
                stale: false,
                strategies: [
                    {
                        name: 'default',
                        parameters: {},
                    },
                ],
                variants: null,
            },
            {
                name: 'arbeidssokerregistrering.mer-oppfolging',
                type: 'release',
                enabled: false,
                stale: false,
                strategies: [
                    {
                        name: 'default',
                        parameters: {},
                    },
                ],
                variants: null,
            },
            {
                name: 'arbeidssokerregistrering.ny-ingress',
                type: 'release',
                enabled: false,
                stale: false,
                strategies: [
                    {
                        name: 'byCluster',
                        parameters: {
                            cluster: 'dev-gcp,dev-sbs,prod-gcp,prod-sbs',
                        },
                        constraints: [],
                    },
                ],
                variants: [],
            },
        ],
    });
};

export default featureToggles;
