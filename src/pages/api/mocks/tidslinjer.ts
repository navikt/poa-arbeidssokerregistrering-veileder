import type { NextApiRequest, NextApiResponse } from 'next';

const tidslinjer = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(data);
};

const data = {
    tidslinjer: [],
};

export default tidslinjer;
