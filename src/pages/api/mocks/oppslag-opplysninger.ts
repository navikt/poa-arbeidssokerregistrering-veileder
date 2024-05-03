import type { NextApiRequest, NextApiResponse } from 'next';

const oppslagOpplysninger = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(data);
};

const data = [
    {
        opplysningerOmArbeidssoekerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        sendtInnAv: {
            tidspunkt: '2021-09-29T11:22:33.444Z',
            utfoertAv: {
                type: 'UKJENT_VERDI',
            },
            kilde: 'string',
            aarsak: 'string',
        },
        utdanning: {
            nus: 'string',
            bestaatt: 'JA',
            godkjent: 'JA',
        },
        helse: {
            helsetilstandHindrerArbeid: 'JA',
        },
        annet: {
            andreForholdHindrerArbeid: 'JA',
        },
        jobbsituasjon: [
            {
                beskrivelse: 'HAR_SAGT_OPP',
                detaljer: {
                    prosent: '25',
                },
            },
        ],
    },
];

export default oppslagOpplysninger;
