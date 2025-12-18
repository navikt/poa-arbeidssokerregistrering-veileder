import { NextApiRequest, NextApiResponse } from 'next';

/*const behovsvurdering = (req: NextApiRequest, res: NextApiResponse) => {
    return res.setHeader('Content-Type', 'application/json').status(204).end();
};*/

const behovsvurdering = (req: NextApiRequest, res: NextApiResponse) => {
    return res.json(data);
};

const data = {
    oppfolging: 'STANDARD_INNSATS',
    dato: '2021-09-29T11:22:33.444Z',
    dialogId: 'eb39f0ee-ddba-42a1-8ed3-590285b2e279',
    profileringId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};
export default behovsvurdering;
