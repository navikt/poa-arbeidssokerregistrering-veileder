import { BodyLong, Box, List, Heading } from '@navikt/ds-react';

import { REGLER_SOM_IKKE_KAN_OVERSTYRES } from './arbeidssoekerstatus-oversikt';

interface AarsakerProps {
    feilmelding?: any;
}

const TILTAKSLISTE = {
    IKKE_FUNNET: ['Her er en ting å gjøre', 'Her er en annen ting å gjøre'],
    DOED: ['Her er en ting å gjøre', 'Her er en annen ting å gjøre'],
    SAVNET: ['Her er en ting å gjøre', 'Her er en annen ting å gjøre'],
    ANSATT_IKKE_TILGANG_TIL_BRUKER: ['Her er en ting å gjøre', 'Her er en annen ting å gjøre'],
};

function AarsakerTilAtPersonenIkkeKanRegistreres(props: AarsakerProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const { regel } = aarsakTilAvvisning || {};

    const regelKanOverstyres = !REGLER_SOM_IKKE_KAN_OVERSTYRES.includes(regel);

    if (!regel || regelKanOverstyres) return null;

    const tiltaksliste = TILTAKSLISTE[regel] || ['Ingen tiltak funnet'];

    return (
        <Box>
            <Heading level="2" size="small">
                Hva må ordnes før personen kan registreres?
            </Heading>
            <BodyLong spacing>Personen kan ikke registreres før registerdata er oppdatert.</BodyLong>
            <List as="ul" title="Dette kan du gjøre">
                {tiltaksliste.map((tiltak) => (
                    <List.Item>{tiltak}</List.Item>
                ))}
            </List>
        </Box>
    );
}

export default AarsakerTilAtPersonenIkkeKanRegistreres;
