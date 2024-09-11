import type { NextApiRequest, NextApiResponse } from 'next';

const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.setHeader('x-trace-id', 'tracetest');
    res.status(204).end();
};

/*
//Feilmelding for de under 18 år
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.setHeader('x-trace-id', 'tracetest');
    res.status(403).json(UNDER_18_AAR);
};

const UNDER_18_AAR = {
    aarsakTilAvvisning: {
        regler: [
            {
                id: 'UNDER_18_AAR',
                beskrivelse: 'Er bosatt i Norge i henhold Folkeregisterloven, men er under 18 år',
            },
        ],
        detaljer: ['UNDER_18_AAR'],
    },
    feilKode: 'AVVIST',
    melding: 'Er under 18 år',
    status: 403,
};
*/

/*
// Feilmelding for utflyttet
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(403).json(IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN);
};

const IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN = {
    "melding": "Avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven",
    "feilKode": "AVVIST",
    "aarsakTilAvvisning": {
        regler: [{
          id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN',
          "beskrivelse": "Avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven",
        }],
        "detaljer": [
            "IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN",
            "ER_OVER_18_AAR",
            "INGEN_ADRESSE_FUNNET",
            "IKKE_BOSATT",
            "INGEN_INFORMASJON_OM_OPPHOLDSTILLATELSE",
            "SISTE_FLYTTING_VAR_UT_AV_NORGE",
            "TOKENX_PID_IKKE_FUNNET",
            "ANSATT_TILGANG"
        ]
    },
    "status": 403,
    "traceId": "130fcc303eb818c9e16e4ba0b6d45fba"
};

*/
/*
// Feilmelding for de som er registrert død
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.setHeader('x-trace-id', 'tracetest');
    res.status(403).json(DOED);
};

const DOED = {
    aarsakTilAvvisning: {
        regeler: [{
          id: 'DOED',
          beskrivelse: "Er registrert som død",
        }],
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
    res.status(403).json(SAVNET);
};

const SAVNET = {
    aarsakTilAvvisning: {
        regler: [{
          id: 'SAVNET',
          beskrivelse: "Er registrert som savnet",
        }],
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
    res.status(403).json(IKKE_FUNNET);
};

const IKKE_FUNNET = {
    aarsakTilAvvisning: {
        regler: [{
          id: 'IKKE_FUNNET',
          beskrivelse: "Person ikke funnet",
        }],
        detaljer: ["IKKE_FUNNET", "PERSON_IKKE_FUNNET"]
    },
    feilKode: "AVVIST",
    melding: "Person ikke funnet",
    status: 403
}
*/

/*
// Feilmelding for de som ikke er funnet
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(403).json(IKKE_FUNNET);
};

const IKKE_FUNNET = {
    aarsakTilAvvisning: {
        regler: [{
          id: 'IKKE_FUNNET',
          beskrivelse: "Person ikke funnet",
        }],
        detaljer: ["IKKE_FUNNET", "PERSON_IKKE_FUNNET"]
    },
    feilKode: "AVVIST",
    melding: "Person ikke funnet",
    status: 403
}
*/

/*
// Feilmelding for ansatt som ikke har tilgang
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(403).json(ANSATT_IKKE_TILGANG_TIL_BRUKER);
};


const ANSATT_IKKE_TILGANG_TIL_BRUKER = {
    aarsakTilAvvisning: {
        regler: [{
          id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER',
          beskrivelse: "Ansatt har ikke tilgang til bruker",
        }],
        detaljer: ["ANSATT_IKKE_TILGANG_TIL_BRUKER", "ANSATT_IKKE_TILGANG"]
    },
    feilKode: "AVVIST",
    melding: "Ansatt har ikke tilgang til bruker",
    status: 403
}
*/

/*
// Feilmelding for arbeidssøker med ukjent alder
const kanStarteArbeidssoekerperiode = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(403).json(UKJENT_ALDER);
};

const UKJENT_ALDER = {
    aarsakTilAvvisning: {
        regler: [
         {
            id: 'UKJENT_ALDER"',
            beskrivelse: 'Kunne ikke fastslå alder'
          }
        ],
        detaljer: ["UKJENT_ALDER", "UKJENT_FOEDSELSDATO", "UKJENT_FOEDSELSAAR"]
    },
    feilKode: "AVVIST",
    melding: "Kunne ikke fastslå alder",
    status: 403
}
*/

export default kanStarteArbeidssoekerperiode;
