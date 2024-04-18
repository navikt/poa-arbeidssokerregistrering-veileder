import { Box, BodyLong, List, Heading } from '@navikt/ds-react';

interface VurderingskriterierProps {
    feilmelding?: any;
}

function VurderingskriterierForArbeidssoekerregistrering(props: VurderingskriterierProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const { regel } = aarsakTilAvvisning || {};

    if (!regel) return null;

    return (
        <Box>
            <Heading level="2" size="small">
                Vilkårsvurdering
            </Heading>
            <BodyLong spacing>
                Før du kan registrere personen som arbeidssøker må du vurdere om vilkårene for registrering er oppfylt.
            </BodyLong>
            <BodyLong spacing>Du må opprette et notat og dokumentere vurderingene i Gosys.</BodyLong>
            <List as="ul" title="Årsakene til at du må gjøre en vurdering">
                <List.Item>Her er en grunn</List.Item>
                <List.Item>Her er en annen grunn</List.Item>
            </List>
        </Box>
    );
}

export default VurderingskriterierForArbeidssoekerregistrering;
