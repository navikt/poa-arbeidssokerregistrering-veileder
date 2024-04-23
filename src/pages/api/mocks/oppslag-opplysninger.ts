import type { NextApiRequest, NextApiResponse } from 'next';

const oppslagOpplysninger = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(204).end();
};

export default oppslagOpplysninger;
