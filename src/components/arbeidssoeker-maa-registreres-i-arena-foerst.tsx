import { Box, BodyLong, Heading, List } from '@navikt/ds-react';

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
        <Box className="mb-8">
            <Heading level="3" size="small" className="navds-heading navds-heading--xsmall">
                Trenger personen å være registrert i Arena?
            </Heading>
            <BodyLong>
                Hvis du ønsker at personen skal hentes inn i Arena må dette gjøres <strong>før</strong> personen
                registreres som arbeidssøker.
            </BodyLong>
            <List as="ol" size="small">
                <List.Item>Sjekk om personen allerede ligger i Arena</List.Item>
                <List.Item>Registrer personen i Arena hvis hen ikke allerede er registrert der</List.Item>
                <List.Item>Registrer personen som arbeidssøker</List.Item>
            </List>
        </Box>
    );
}

export default ArbeidssoekerMaaRegistreresIArena;
