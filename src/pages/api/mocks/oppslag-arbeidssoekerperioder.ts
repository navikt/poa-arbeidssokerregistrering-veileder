import type { NextApiRequest, NextApiResponse } from 'next';

const oppslagArbeidssoekerperioder = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(data);
};

/*
// Ingen tidligere arbeidssøkerperioder
const data = [];
*/

// Aktvi arbeidssøkerperiode fra dev

const data = [
    {
        periodeId: '3950569a-ffb1-4c70-b75d-14e808e91517',
        startet: {
            tidspunkt: '2024-05-07T08:32:26.915Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
            aarsak: 'Er over 18 år, er bosatt i Norge i hendhold Folkeregisterloven',
        },
        avsluttet: {
            tidspunkt: '2024-05-14T11:42:26.902Z',
            utfoertAv: {
                type: 'VEILEDER',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
            aarsak: 'Ansatt har tilgang til bruker',
        },
    },
    {
        periodeId: '082b0a10-7280-4c6e-8749-dbf28f71dd87',
        startet: {
            tidspunkt: '2024-05-14T11:42:43.771Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
            aarsak: 'Er over 18 år, er bosatt i Norge i hendhold Folkeregisterloven',
        },
        avsluttet: null,
    },
];

/*
// Aktiv arbeidssøkerperiode
const data = [
    {
        periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        startet: {
            tidspunkt: '2021-09-29T11:22:33.444Z',
            utfoertAv: {
                type: 'UKJENT_VERDI',
            },
            kilde: 'string',
            aarsak: 'string',
        },
        avsluttet: null,
    },
];
*/
/*const data = [
    {
        periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        startet: {
            tidspunkt: '2021-09-29T11:22:33.444Z',
            utfoertAv: {
                type: 'UKJENT_VERDI',
            },
            kilde: 'string',
            aarsak: 'string',
        },
        avsluttet: {
            tidspunkt: '2021-09-29T11:22:33.444Z',
            utfoertAv: {
                type: 'UKJENT_VERDI',
            },
            kilde: 'string',
            aarsak: 'string',
        },
    },
];*/

export default oppslagArbeidssoekerperioder;
