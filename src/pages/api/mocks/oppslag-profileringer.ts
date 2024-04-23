import type { NextApiRequest, NextApiResponse } from 'next';

const oppslagProfileringer = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(204).end();
};

export default oppslagProfileringer;
