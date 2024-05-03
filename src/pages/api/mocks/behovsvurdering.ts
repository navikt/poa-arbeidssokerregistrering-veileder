import { NextApiRequest, NextApiResponse } from 'next';

const behovsvurdering = (req: NextApiRequest, res: NextApiResponse) => {
    return res.setHeader('Content-Type', 'application/json').status(204).end();
};

export default behovsvurdering;
