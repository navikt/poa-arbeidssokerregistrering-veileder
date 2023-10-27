import type { NextApiRequest, NextApiResponse } from 'next';

const isReadyHandler = (req: NextApiRequest, res: NextApiResponse<string>): void => {
    res.status(200).json('Ready');
};

export default isReadyHandler;
