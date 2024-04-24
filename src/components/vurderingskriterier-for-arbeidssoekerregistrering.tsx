import { Box, BodyLong, List, Heading } from '@navikt/ds-react';

import { REGLER_SOM_KAN_OVERSTYRES } from './arbeidssoekerstatus-oversikt';

interface VurderingskriterierProps {
    feilmelding?: any;
}

const TILTAKSLISTE = {
    UNDER_18_AAR: [
        {
            id: '02dd3c41-e39b-401e-8746-f33924c3be2b',
            beskrivelse: 'Det kreves samtykke fra foresatte for å kunne registrere mindreårige som arbeidssøkere',
        },
    ],
    UKJENT_ALDER: [
        {
            id: 'd4bc30ee-d2e6-488e-9fd5-acad67e26f99',
            beskrivelse: 'Her er en grunn',
        },
        {
            id: '1138cc8c-1c2f-47df-a582-77fdfd12c185',
            beskrivelse: 'Her er en annen grunn',
        },
    ],
    IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN: [
        {
            id: '773558b7-5336-4cc9-8df0-0c811e38dcd0',
            beskrivelse: 'Her er en grunn',
        },
        {
            id: '4adf4a48-9fef-4b03-8020-f1379e695d47',
            beskrivelse: 'Her er en annen grunn',
        },
    ],
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
                    <List.Item key={tiltak.id}>{tiltak.beskrivelse}</List.Item>
                ))}
            </List>
        </Box>
    );
}

export default VurderingskriterierForArbeidssoekerregistrering;
