import type { NextApiRequest, NextApiResponse } from 'next';

const oppgave = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(200).json({
        id: 0,
        tildeltEnhetsnr: 'string',
        oppgaveType: 'OPPHOLDSTILLATELSE',
    });
};

export default oppgave;
