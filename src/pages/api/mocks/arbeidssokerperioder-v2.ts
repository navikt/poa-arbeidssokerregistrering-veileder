import type { NextApiRequest, NextApiResponse } from 'next';

const startArbeidssokerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(204).end();
};

/*
// Feilmelding for de under 18 år
const startArbeidssokerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(UNDER_18_AAR);
};

const UNDER_18_AAR = {
    aarsakTilAvvisning: {
        regler: [{
          id: '',
          beskrivelse: "Er bosatt i Norge i henhold Folkeregisterloven, men er under 18 år",
        }]
        detaljer: ["UNDER_18_AAR", "ER_UNDER_18_AAR"]
    },
    feilKode: "AVVIST",
    melding: "Er under 18 år",
    status: 403
}
*/

/*
// Feilmelding for de som er registrert død
const startArbeidssokerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(DOED);
};

const DOED = {
    aarsakTilAvvisning: {
        regler: [
          {
            id: '',
            beskrivelse: "Er registrert som død",
          }
        ]
        detaljer: ["DOED"]
    },
    feilKode: "AVVIST",
    melding: "Er registrert som død",
    status: 403
}
*/

export default startArbeidssokerperiode;
