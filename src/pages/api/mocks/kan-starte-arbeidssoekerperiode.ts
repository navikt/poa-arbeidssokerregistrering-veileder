import type { NextApiRequest, NextApiResponse } from 'next';

const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(204).end();
};

/*// Feilmelding for de under 18 år
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(UNDER_18_AAR);
};

const UNDER_18_AAR = {
    aarsakTilAvvisning: {
        beskrivelse: 'Er bosatt i Norge i henhold Folkeregisterloven, men er under 18 år',
        regel: 'UNDER_18_AAR',
        detaljer: ['ER_UNDER_18_AAR'],
    },
    feilKode: 'AVVIST',
    melding: 'Er under 18 år',
    status: 403,
};*/

/*
// Feilmelding for de som er registrert død
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(DOED);
};

const DOED = {
    aarsakTilAvvisning: {
        beskrivelse: "Er registrert som død",
        regel: "DOED",
        detaljer: ["DOED"]
    },
    feilKode: "AVVIST",
    melding: "Er registrert som død",
    status: 403
}
*/

/*
// Feilmelding for de som er registrert savnet
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(SAVNET);
};

const SAVNET = {
    aarsakTilAvvisning: {
        beskrivelse: "Er registrert som savnet",
        regel: "SAVNET",
        detaljer: ["SAVNET"]
    },
    feilKode: "AVVIST",
    melding: "Er registrert som savnet",
    status: 403
}
*/

/*
// Feilmelding for de som ikke er funnet
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(IKKE_FUNNET);
};

const IKKE_FUNNET = {
    aarsakTilAvvisning: {
        beskrivelse: "Person ikke funnet",
        regel: "IKKE_FUNNET",
        detaljer: ["PERSON_IKKE_FUNNET"]
    },
    feilKode: "AVVIST",
    melding: "Person ikke funnet",
    status: 403
}
*/

/*
// Feilmelding for de som ikke er funnet
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(IKKE_FUNNET);
};

const IKKE_FUNNET = {
    aarsakTilAvvisning: {
        beskrivelse: "Person ikke funnet",
        regel: "IKKE_FUNNET",
        detaljer: ["PERSON_IKKE_FUNNET"]
    },
    feilKode: "AVVIST",
    melding: "Person ikke funnet",
    status: 403
}
*/

/*
// Feilmelding for ansatt som ikke har tilgang
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(ANSATT_IKKE_TILGANG_TIL_BRUKER);
};

const ANSATT_IKKE_TILGANG_TIL_BRUKER = {
    aarsakTilAvvisning: {
        beskrivelse: "Ansatt har ikke tilgang til bruker",
        regel: "ANSATT_IKKE_TILGANG_TIL_BRUKER",
        detaljer: ["ANSATT_IKKE_TILGANG"]
    },
    feilKode: "AVVIST",
    melding: "Ansatt har ikke tilgang til bruker",
    status: 403
}
*/

/*
// Feilmelding for arbeidssøker med ukjent alder
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(404).json(UKJENT_ALDER);
};

const UKJENT_ALDER = {
    aarsakTilAvvisning: {
        beskrivelse: "Kunne ikke fastslå alder",
        regel: "UKJENT_ALDER",
        detaljer: ["UKJENT_FOEDSELSDATO", "UKJENT_FOEDSELSAAR"]
    },
    feilKode: "AVVIST",
    melding: "Kunne ikke fastslå alder",
    status: 403
}
*/

export default kanStarteArbeidssoekerperiode;
