import type { NextApiRequest, NextApiResponse } from 'next';

const oppslagProfileringer = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(data);
};

const data = [
    {
        profileringId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        opplysningerOmArbeidssoekerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        sendtInnAv: {
            tidspunkt: '2021-09-29T11:22:33.444Z',
            utfoertAv: {
                type: 'UKJENT_VERDI',
            },
            kilde: 'string',
            aarsak: 'string',
        },
        profilertTil: 'UKJENT_VERDI',
        jobbetSammenhengendeSeksAvTolvSisteManeder: true,
        alder: 0,
    },
];

export default oppslagProfileringer;
