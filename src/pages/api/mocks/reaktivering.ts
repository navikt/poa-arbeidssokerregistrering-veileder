import { NextApiRequest, NextApiResponse } from 'next';

const reaktiveringHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        return res.status(204).end();
    } else {
        return res.status(405).end();
    }
};

export default reaktiveringHandler;
