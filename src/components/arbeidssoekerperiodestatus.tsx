import { BodyLong, Box, Heading } from '@navikt/ds-react';
import { ArbeidssokerPeriode } from '@navikt/arbeidssokerregisteret-utils';

import { formaterDato } from '../lib/date-utils';

export type ArbeidssoekerperiodeEllerTom = ArbeidssokerPeriode | {};

interface ArbeidssoekerperiodeStatusProps {
    sisteArbeidssoekerperiode: ArbeidssokerPeriode;
}

function ArbeidssoekerperiodeStatus(props: ArbeidssoekerperiodeStatusProps) {
    const { sisteArbeidssoekerperiode } = props || {};

    if (!sisteArbeidssoekerperiode) return null;

    const harAktivPeriode = sisteArbeidssoekerperiode?.avsluttet === null;

    const statusTekst = harAktivPeriode
        ? 'Personen er registrert som arbeidssøker'
        : 'Personen er ikke registrert som arbeidssøker';
    const periodeBeskrivelse = harAktivPeriode
        ? `Registreringsdato: ${formaterDato(sisteArbeidssoekerperiode.startet.tidspunkt)}`
        : `Siste arbeidssøkerperiode var ${formaterDato(sisteArbeidssoekerperiode.startet.tidspunkt)} - ${formaterDato(sisteArbeidssoekerperiode.avsluttet.tidspunkt)}`;

    return (
        <Box>
            <Heading level="1" size="small">
                Arbeidssøkerstatus
            </Heading>
            <BodyLong>{statusTekst}</BodyLong>
            <BodyLong>{periodeBeskrivelse}</BodyLong>
            <BodyLong>{JSON.stringify(sisteArbeidssoekerperiode)}</BodyLong>
        </Box>
    );
}

export default ArbeidssoekerperiodeStatus;
