import { Box, BodyLong, List } from '@navikt/ds-react';

import { REGLER_SOM_KAN_OVERSTYRES } from '../model/regler-for-avvisning';

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
            beskrivelse: 'Systemene vår kan ikke bekrefte personens alder',
        },
    ],
    IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN: [
        {
            id: '773558b7-5336-4cc9-8df0-0c811e38dcd0',
            beskrivelse: 'Adressene vi finner i våre systemer oppfyller ikke kravene til registrering',
        },
    ],
    ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT: [
        {
            id: 'e70c919a-673a-4fca-803b-fa1e412f90c1',
            beskrivelse: 'Personen står som utflyttet i registerene',
        },
    ],
};

function VurderingskriterierForArbeidssoekerregistrering(props: VurderingskriterierProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};

    if (!feilmelding) return null;

    const aarsaker = aarsakTilAvvisning?.regler ? aarsakTilAvvisning.regler.map((regel) => regel.id) : [];
    const reglerSomIkkeKanOverstyres = aarsaker.filter((regel) => !REGLER_SOM_KAN_OVERSTYRES.includes(regel));
    const kanAlleReglerOverstyres = reglerSomIkkeKanOverstyres.length === 0;

    if (!aarsaker || !kanAlleReglerOverstyres) return null;

    const tiltaksliste = aarsaker.reduce((liste, regel) => {
        liste.push(...TILTAKSLISTE[regel]);
        return liste;
    }, []) || ['Ingen tiltak funnet'];

    return (
        <Box>
            <List as="ul" size="small" title="Hvorfor må jeg gjøre en vurdering av om personen skal kunne registreres?">
                {tiltaksliste.map((tiltak) => (
                    <List.Item key={tiltak.id}>{tiltak.beskrivelse}</List.Item>
                ))}
            </List>
            <BodyLong spacing>Du må opprette et notat og dokumentere vurderingene i Gosys.</BodyLong>
        </Box>
    );
}

export default VurderingskriterierForArbeidssoekerregistrering;
