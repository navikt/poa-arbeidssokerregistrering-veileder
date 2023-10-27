import type { NextApiRequest, NextApiResponse } from 'next';

const profilering = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(200).json({
        innsatsgruppe: 'STANDARD_INNSATS',
        servicegruppe: 'IVURD',
    });
};

export default profilering;
