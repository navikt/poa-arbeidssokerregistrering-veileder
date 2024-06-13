import { Box, BodyLong, Heading } from '@navikt/ds-react';

interface OpplysningerProps {
    feilmelding?: any;
}

function ArbeidssoekerMaaRegistreresIArena(props: OpplysningerProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const detaljer = aarsakTilAvvisning?.detaljer ? aarsakTilAvvisning.detaljer : [];
    const maaRegistreresIArena = detaljer.includes('SISTE_FLYTTING_VAR_UT_AV_NORGE');

    if (!maaRegistreresIArena) return null;

    return (
        <Box>
            <Heading level="2" size="small">
                Personen må være registrert i Arena
            </Heading>
            <BodyLong spacing>
                Dersom du ønsker at personen skal hentes inn i Arena etter registrering som arbeidssøker så må
                vedkommende være registrert der fra før.
            </BodyLong>
            <BodyLong spacing>
                Sjekk om personen finnes i Arena, hvis ikke må du registrere vedkommende der før du går videre.
            </BodyLong>
        </Box>
    );
}

export default ArbeidssoekerMaaRegistreresIArena;
