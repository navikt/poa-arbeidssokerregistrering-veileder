import { BodyLong, Box, List, Heading } from '@navikt/ds-react';

import { REGLER_SOM_IKKE_KAN_OVERSTYRES } from './arbeidssoekerstatus-oversikt';

interface AarsakerProps {
    feilmelding?: any;
}

const TILTAKSLISTE = {
    IKKE_FUNNET: [
        {
            id: 'd0ac2b05-108c-4128-a075-6f4567bab28e',
            beskrivelse: 'Sjekk at du har tastet inn korrekt personident',
        },
    ],
    DOED: [
        {
            id: '8101c97d-2beb-4fee-ad86-3eb3c3e280b4',
            beskrivelse: 'Sjekk at du har tastet inn korrekt personident',
        },
        {
            id: 'ca57f913-1932-40ba-8cde-fe1475673166',
            beskrivelse:
                'Personen kan selv kontakte folkeregisteret for å gjøre endringer her https://www.skatteetaten.no/person/folkeregister/endre/',
        },
        {
            id: '95f78e60-a000-4835-82dc-84628b0c2416',
            beskrivelse:
                'Hvis du ønsker å hjelpe personen med å registrere endringer hos folkeregisteret kan du gjøre det her https://www.skatteetaten.no/person/folkeregister/tips-om-avvik-i-folkeregisteret/for-offentlige/',
        },
    ],
    SAVNET: [
        {
            id: 'e1330640-8f60-481e-87c4-1e48109d26ad',
            beskrivelse: 'Sjekk at du har tastet inn korrekt personident',
        },
        {
            id: '5b04b8cc-f3ca-4440-8dd4-dbfbafd87e01',
            beskrivelse:
                'Personen kan selv kontakte folkeregisteret for å gjøre endringer her https://www.skatteetaten.no/person/folkeregister/endre/',
        },
        {
            id: '5af038f6-d6b5-4d2c-8e6b-e554cf4bd60d',
            beskrivelse:
                'Hvis du ønsker å hjelpe personen med å registrere endringer hos folkeregisteret kan du gjøre det her https://www.skatteetaten.no/person/folkeregister/tips-om-avvik-i-folkeregisteret/for-offentlige/',
        },
    ],
    ANSATT_IKKE_TILGANG_TIL_BRUKER: [
        {
            id: '2a933509-6016-4d2c-b19d-90d0747047c5',
            beskrivelse: 'Ta kontakt med din lokale identansvarlig. Dette er vanligvis enhetens leder.',
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
