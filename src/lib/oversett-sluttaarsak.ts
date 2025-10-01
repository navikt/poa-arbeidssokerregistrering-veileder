import { lagHentTekstForSprak, Sprak } from '@navikt/arbeidssokerregisteret-utils';

const TEKSTER = {
    nb: {
        'fortsatt aktiv': 'Arbeidssøkerperioden er fortsatt aktiv',
        'graceperiode utløpt': 'Ikke bekreftet arbeidssøkerstatus',
        'stopp av periode': 'Arbeidssøkerperioden er avsluttet av veileder',
        feilregistrering: 'Slettet på grunn av feilregistrering',
        "svarte nei på spørsmål 'vil du fortsatt være registrert som arbeidssøker?'": 'Stoppet av bruker',
        'personen er ikke bosatt etter folkeregisterloven':
            'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        'avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven':
            'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        'er registrert som død, avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven':
            'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        'personen er doed': 'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        'er registrert som død': 'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        iserv: 'Arbeidssøkerperioden er avsluttet i Arena',
        overføring: 'Arbeidssøkerperioden er avsluttet i Arena',
        'har ugyldig/annullert identitet, kunne ikke fastslå alder, avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven':
            'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        '[bekreftelse] ikke levert innen fristen':
            'Bekreftelse på arbeidssøkerperiode ikke levert innen fristen. Periode er avsluttet av systemet.',
        '[bekreftelse] ønsket ikke lenger å være arbeidssøker': 'Svarte "Nei" til å være arbeidssøker på bekreftelsen',
    },
};

export function oversettSluttaarsak(sprak: Sprak) {
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);
    return function (tekststreng: string) {
        const oversatt = tekst(tekststreng.toLocaleLowerCase());
        return oversatt || tekststreng;
    };
}
