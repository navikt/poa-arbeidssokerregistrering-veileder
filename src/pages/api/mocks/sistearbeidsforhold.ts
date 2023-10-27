import type { NextApiRequest, NextApiResponse } from 'next';

const sisteArbeidsforhold = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(200).json({
        arbeidsgiverOrgnummer: '123456789',
        styrk: '2130123',
        fom: '2019-02-01T12:00:00+01:00',
        tom: null,
    });
};

export default sisteArbeidsforhold;
