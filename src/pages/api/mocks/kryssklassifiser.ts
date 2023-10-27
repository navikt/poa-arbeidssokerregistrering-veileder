import type { NextApiRequest, NextApiResponse } from 'next';

const kryssklassifiser = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(200).json({ konseptMedStyrk08List: [{ konseptId: 22490, label: 'IT-konsulent', styrk08: ['2511'] }] });
};

export default kryssklassifiser;
