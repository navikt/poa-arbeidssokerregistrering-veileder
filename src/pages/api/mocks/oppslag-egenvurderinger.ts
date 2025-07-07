import type { NextApiRequest, NextApiResponse } from 'next';

const oppslagEgenvurderinger = (req: NextApiRequest, res: NextApiResponse): void => {
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
                id: '12345678910',
            },
            kilde: 'string',
            aarsak: 'string',
            tidspunktFraKilde: {
                tidspunkt: '2021-09-29T11:20:33.444Z',
                avviksType: 'UKJENT_VERDI',
            },
        },
        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
        egenvurdering: 'ANTATT_GODE_MULIGHETER',
    },
];

export default oppslagEgenvurderinger;
