import { NextApiRequest, NextApiResponse } from 'next';

function decorator(req: NextApiRequest, res: NextApiResponse): void {
    res.status(200).json({ decorator: 'ok' });
}

export default decorator;
