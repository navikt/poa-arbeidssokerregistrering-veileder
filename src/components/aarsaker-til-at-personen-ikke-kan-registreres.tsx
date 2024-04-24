import { BodyLong, Box, List, Heading } from '@navikt/ds-react';

import { REGLER_SOM_IKKE_KAN_OVERSTYRES } from './arbeidssoekerstatus-oversikt';

interface AarsakerProps {
    feilmelding?: any;
}

const TILTAKSLISTE = {
    IKKE_FUNNET: [
        {
            id: 'd0ac2b05-108c-4128-a075-6f4567bab28e',
            beskrivelse: 'Her er en ting å gjøre',
        },
        {
            id: 'd842b957-87f5-4d2f-a376-ed0f8db665f4',
            beskrivelse: 'Her er en annen ting å gjøre',
        },
    ],
    DOED: [
        {
            id: '8101c97d-2beb-4fee-ad86-3eb3c3e280b4',
            beskrivelse: 'Her er en ting å gjøre',
        },
        {
            id: 'ca57f913-1932-40ba-8cde-fe1475673166',
            beskrivelse: 'Her er en annen ting å gjøre',
        },
    ],
    SAVNET: [
        {
            id: 'e1330640-8f60-481e-87c4-1e48109d26ad',
            beskrivelse: 'Her er en ting å gjøre',
        },
        {
            id: '5b04b8cc-f3ca-4440-8dd4-dbfbafd87e01',
            beskrivelse: 'Her er en annen ting å gjøre',
        },
    ],
    ANSATT_IKKE_TILGANG_TIL_BRUKER: [
        {
            id: '2a933509-6016-4d2c-b19d-90d0747047c5',
            beskrivelse: 'Her er en ting å gjøre',
        },
        {
            id: '6d5af0fa-7604-49fd-b418-5c15762e4b32',
            beskrivelse: 'Her er en annen ting å gjøre',
        },
    ],
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
                    <List.Item key={tiltak.id}>{tiltak.beskrivelse}</List.Item>
                ))}
            </List>
        </Box>
    );
}

export default AarsakerTilAtPersonenIkkeKanRegistreres;
