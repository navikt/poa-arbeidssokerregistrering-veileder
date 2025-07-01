import { Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Heading } from '@navikt/ds-react';

import { Tidslinje } from '../../model/tidslinjer';

export interface TidslinjeProps {
    sprak: Sprak;
    tidslinjer: Tidslinje[];
}

const TEKSTER = {
    nb: {
        startet: 'Startet',
        avsluttet: 'Avsluttet',
        sluttarsak: 'Sluttårsak',
        periode: 'Periode',
        av: 'av',
        SLUTTBRUKER: 'bruker',
        SYSTEM: 'Nav',
        VEILEDER: 'veileder',
        'fortsatt aktiv': 'fortsatt aktiv',
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
    },
};

export function TidslinjerWrapper(props: TidslinjeProps) {
    const { tidslinjer } = props;
    return (
        <>
            <Heading level="2" size="large">
                Tidslinje
            </Heading>
            <pre>{JSON.stringify(tidslinjer, null, 2)}</pre>
        </>
    );
}
