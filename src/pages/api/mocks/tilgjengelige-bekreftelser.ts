import type { NextApiRequest, NextApiResponse } from 'next';

const tilgjengeligeBekreftelser = (req: NextApiRequest, res: NextApiResponse) => {
    return res.json([
        {
            periodeId: '2',
            bekreftelseId: '3',
            gjelderFra: '2024-07-01T10:36:40.474Z',
            gjelderTil: '2024-08-13T10:36:40.474Z',
        },
        {
            periodeId: '1',
            bekreftelseId: '2',
            gjelderFra: '2024-09-01T10:36:40.474Z',
            gjelderTil: '2024-09-13T10:36:40.474Z',
        },
    ]);
};

export default tilgjengeligeBekreftelser;
