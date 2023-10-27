import type { NextApiRequest, NextApiResponse } from 'next';

function kontaktinformasjon(req: NextApiRequest, res: NextApiResponse): void {
    res.status(200).json({
        telefonnummerHosKrr: '12345678',
        telefonnummerHosNav: '87654321',
        navn: {
            fornavn: 'Kasper',
            mellomnavn: 'Jesper',
            etternavn: 'Jonatan',
        },
    });
}

export default kontaktinformasjon;
