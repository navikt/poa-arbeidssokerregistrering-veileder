import { Box, BodyLong, List, Heading } from '@navikt/ds-react';

import { REGLER_SOM_KAN_OVERSTYRES } from './arbeidssoekerstatus-oversikt';

interface VurderingskriterierProps {
    feilmelding?: any;
}

const TILTAKSLISTE = {
    UNDER_18_AAR: ['Det kreves samtykke fra foresatte for å kunne registrere mindreårige som arbeidssøkere'],
    UKJENT_ALDER: ['Her er en grunn', 'Her er en annen grunn'],
    IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN: ['Her er en grunn', 'Her er en annen grunn'],
};

function VurderingskriterierForArbeidssoekerregistrering(props: VurderingskriterierProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const { regel } = aarsakTilAvvisning || {};
    const kanRegelOverstyres = REGLER_SOM_KAN_OVERSTYRES.includes(regel);

    if (!regel || !kanRegelOverstyres) return null;

    const tiltaksliste = TILTAKSLISTE[regel] || ['Ingen tiltak funnet'];

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
                {tiltaksliste.map((tiltak) => (
                    <List.Item>{tiltak}</List.Item>
                ))}
            </List>
        </Box>
    );
}

export default VurderingskriterierForArbeidssoekerregistrering;
