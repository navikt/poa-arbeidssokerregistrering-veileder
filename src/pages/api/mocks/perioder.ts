import type { NextApiRequest, NextApiResponse } from 'next';
import perioderJson from './perioder.json';

const perioder = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(perioderJson);
};
export default perioder;
