import { NextApiRequest, NextApiResponse } from 'next';

function handler(req: NextApiRequest, res: NextApiResponse): void {
    res.status(200).json({});
}

export default handler;
