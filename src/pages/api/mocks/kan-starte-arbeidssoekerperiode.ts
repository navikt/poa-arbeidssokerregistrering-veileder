import type { NextApiRequest, NextApiResponse } from 'next';

/*
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(204).end();
};
*/

// Feilmelding for de under 18 år
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(UNDER_18_AAR);
};

const UNDER_18_AAR = {
    aarsakTilAvvisning: {
        beskrivelse: 'Er bosatt i Norge i hendhold Folkeregisterloven, men er under 18 år',
        regel: 'UNDER_18_AAR',
        detaljer: ['ER_UNDER_18_AAR'],
    },
    feilKode: 'AVVIST',
    melding: 'Er under 18 år',
    status: 403,
};

export default kanStarteArbeidssoekerperiode;
