import type { NextApiRequest, NextApiResponse } from 'next';
import perioder from './perioder.json';

const tidslinjer = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(perioder);
};
export default tidslinjer;
