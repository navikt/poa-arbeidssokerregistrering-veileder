import { NextApiRequest, NextApiResponse } from 'next';

const fullforHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        return res.status(200).json({});
    } else {
        return res.status(405).end();
    }
};

export default fullforHandler;
