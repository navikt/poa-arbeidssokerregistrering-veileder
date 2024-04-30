import { BodyLong, Box, Heading } from '@navikt/ds-react';
import { Profilering } from '@navikt/arbeidssokerregisteret-utils';

import { formaterDato } from '../lib/date-utils';

const PROFILERINGSMAP = {
    ANTATT_GODE_MULIGHETER: 'Standard innsats',
    ANTATT_BEHOV_FOR_VEILEDNING: 'Situasjonsbestemt innsats',
    OPPGITT_HINDRINGER: 'Behov for arbeidsevnevurdering',
    UKJENT_VERDI: 'Ukjent resultat',
};

interface ProfileringProps {
    sisteProfilering: Profilering;
}

function Profileringsresultat(props: ProfileringProps) {
    const { sisteProfilering } = props || {};
    const { profilertTil, sendtInnAv } = sisteProfilering || {};

    if (!sisteProfilering) return null;

    return (
        <Box>
            <Heading level="1" size="small">
                Profilering
            </Heading>
            <BodyLong>Resulatet av profileringen er "{PROFILERINGSMAP[profilertTil]}"</BodyLong>
            <BodyLong spacing>Profileringer er sist oppdatert {formaterDato(sendtInnAv.tidspunkt)}</BodyLong>
        </Box>
    );
}

export default Profileringsresultat;
