import { BodyLong, Box, Heading } from '@navikt/ds-react';
import { ArbeidssokerPeriode } from '@navikt/arbeidssokerregisteret-utils';

import { formaterDato } from '../lib/date-utils';

export type ArbeidssoekerperiodeEllerTom = ArbeidssokerPeriode | {};

interface ArbeidssoekerperiodeStatusProps {
    sisteArbeidssoekerperiode: ArbeidssokerPeriode;
}

function ArbeidssoekerperiodeHistorikk(props: ArbeidssoekerperiodeStatusProps) {
    const { sisteArbeidssoekerperiode } = props || {};
    const harAktivPeriode = sisteArbeidssoekerperiode?.avsluttet === null;
    const harTidligereArbeidssoekerperiode = sisteArbeidssoekerperiode?.startet;

    if (!harTidligereArbeidssoekerperiode) {
        return <BodyLong spacing>Personen har ingen tidligere arbeidssøkerperioder</BodyLong>;
    }

    if (harAktivPeriode) {
        return (
            <BodyLong spacing>
                Arbeidssøkerperioden startet {formaterDato(sisteArbeidssoekerperiode.startet.tidspunkt)}
            </BodyLong>
        );
    }

    return (
        <BodyLong spacing>
            Siste arbeidssøkerperiode var {formaterDato(sisteArbeidssoekerperiode.startet.tidspunkt)} -{' '}
            {formaterDato(sisteArbeidssoekerperiode.avsluttet.tidspunkt)}
        </BodyLong>
    );
}

function ArbeidssoekerperiodeStatus(props: ArbeidssoekerperiodeStatusProps) {
    const { sisteArbeidssoekerperiode } = props || {};

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
            <ArbeidssoekerperiodeHistorikk sisteArbeidssoekerperiode={sisteArbeidssoekerperiode} />
        </Box>
    );
}

export default ArbeidssoekerperiodeStatus;
