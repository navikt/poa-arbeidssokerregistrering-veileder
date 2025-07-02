import { Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { BodyShort, Accordion } from '@navikt/ds-react';

import { prettyPrintDato } from '../../lib/date-utils';
import { Tidslinje } from '../../model/tidslinjer';
import { HendelseVisning } from './hendelse';

export interface TidslinjerProps {
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

function TidslinjeBox(props: Tidslinje) {
    const { startet, avsluttet, hendelser } = props;
    return (
        <Accordion className="mb-4">
            <Accordion.Item>
                <Accordion.Header>
                    {prettyPrintDato(startet, 'nb', true)} -{' '}
                    {avsluttet ? prettyPrintDato(avsluttet, 'nb', true) : 'fortsatt pågående'}
                </Accordion.Header>
                <Accordion.Content>
                    {hendelser.map((hendelse, index) => (
                        <HendelseVisning {...hendelse} key={`${hendelse}-${index}`} />
                    ))}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
}

export function TidslinjerWrapper(props: TidslinjerProps) {
    const { tidslinjer } = props;

    if (!tidslinjer || tidslinjer.length === 0) {
        return <BodyShort spacing>Ingen arbeidssøkerperioder funnet</BodyShort>;
    }

    return (
        <>
            {tidslinjer.map((tidslinje, index) => (
                <TidslinjeBox {...tidslinje} key={`${tidslinje.periodeId}-${index}`} />
            ))}
        </>
    );
}
