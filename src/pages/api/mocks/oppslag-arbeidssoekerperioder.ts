import type { NextApiRequest, NextApiResponse } from 'next';

const oppslagArbeidssoekerperioder = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(204).end();
};

export default oppslagArbeidssoekerperioder;
