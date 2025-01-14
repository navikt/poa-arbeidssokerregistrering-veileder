import { BodyLong, Box, Heading, ReadMore, Link } from '@navikt/ds-react';
import { ArbeidssokerPeriode } from '@navikt/arbeidssokerregisteret-utils';

import { formaterDato } from '../lib/date-utils';
import { ArbeidssokerperioderResponse } from '@navikt/arbeidssokerregisteret-utils/dist/models/arbeidssokerperiode';

interface ArbeidssoekerperiodeStatusProps {
    perioder: ArbeidssokerperioderResponse;
    sisteArbeidssoekerperiode: ArbeidssokerPeriode;
    harIngenArbeidssoekerperioder: boolean;
}

function ArbeidssoekerperiodeHistorikk(props: ArbeidssoekerperiodeStatusProps) {
    const { perioder, sisteArbeidssoekerperiode, harIngenArbeidssoekerperioder } = props;
    const harAktivPeriode = sisteArbeidssoekerperiode?.avsluttet === null;
    const harTidligereArbeidssoekerperiode = sisteArbeidssoekerperiode?.startet;

    if (!harTidligereArbeidssoekerperiode) {
        return <BodyLong>Personen har ingen tidligere arbeidssøkerperioder</BodyLong>;
    }

    if (harAktivPeriode) {
        return (
            <Box>
                <BodyLong>
                    Arbeidssøkerperioden startet {formaterDato(sisteArbeidssoekerperiode.startet.tidspunkt)}
                </BodyLong>
                <ReadMore header="Avslutte arbeidssøkerperioden?">
                    <BodyLong spacing>
                        For å avslutte arbeidssøkerperioden må du be bruker om å svare nei i meldekortet på spørsmål om
                        de ønsker å fortsatt stå registrert som arbeidssøker.
                    </BodyLong>
                    <BodyLong spacing>
                        Dersom det haster er det også mulig å endre formidlingsgruppen i Arena til ISERV ved å velge
                        oppgavetypen Inaktivering av person.
                    </BodyLong>
                </ReadMore>
            </Box>
        );
    }

    return (
        <BodyLong>
            Siste arbeidssøkerperiode var {formaterDato(sisteArbeidssoekerperiode.startet.tidspunkt)} -{' '}
            {formaterDato(sisteArbeidssoekerperiode.avsluttet.tidspunkt)}
        </BodyLong>
    );
}

function ArbeidssoekerperiodeStatus(props: ArbeidssoekerperiodeStatusProps) {
    const { perioder = [], sisteArbeidssoekerperiode, harIngenArbeidssoekerperioder } = props || {};

    const harAktivPeriode = sisteArbeidssoekerperiode?.avsluttet === null;

    const statusTekst = harAktivPeriode
        ? 'Personen er registrert som arbeidssøker'
        : 'Personen er ikke registrert som arbeidssøker';

    return (
        <Box>
            <Heading level="1" size="small">
                Arbeidssøkerstatus
            </Heading>
            <BodyLong>{statusTekst}</BodyLong>
            {harIngenArbeidssoekerperioder && <BodyLong>Ingen tidligere arbeidssøkerperioder registrert</BodyLong>}
        </Box>
    );
}

export default ArbeidssoekerperiodeStatus;
