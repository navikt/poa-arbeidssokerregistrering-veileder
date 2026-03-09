import { BodyLong, Box, Heading, List } from '@navikt/ds-react';
import type { KanStartePeriodeFeil } from '@/lib/models/kan-starte-periode';

interface AarsakerProps {
    feilmelding: KanStartePeriodeFeil;
    ansattManglerTilgang: boolean;
}

const TILTAKSLISTE: Record<string, { id: string; beskrivelse: string }[]> = {
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

/**
 * Tiltak og instruksjoner for harde regler som IKKE kan overstyres.
 *
 * Vises kun når `RegistreringSjekk` har bestemt at reglene ikke kan overstyres
 * (`!klassifisering.kanAlleReglerOverstyres`). Har to varianter:
 *
 * - **Ansatt mangler tilgang** → "Hva må ordnes før du kan registrere personen?"
 * - **Andre harde regler** → "Hva må ordnes før personen kan registreres?"
 *
 * Ren presentasjonskomponent — `ansattManglerTilgang` kommer ferdig klassifisert fra parent.
 */
function AarsakerTilAtPersonenIkkeKanRegistreres({ feilmelding, ansattManglerTilgang }: AarsakerProps) {
    const aarsaker = feilmelding.aarsakTilAvvisning?.regler?.map((regel) => regel.id) ?? [];

    const tiltaksliste = aarsaker.reduce<{ id: string; beskrivelse: string }[]>((liste, regel) => {
        const tiltak = TILTAKSLISTE[regel];
        if (tiltak) {
            liste.push(...tiltak);
        }
        return liste;
    }, []);

    if (ansattManglerTilgang) {
        return (
            <Box>
                <Heading level='2' size='small'>
                    Hva må ordnes før du kan registrere personen?
                </Heading>
                <BodyLong spacing>Du må få korrekt tilgang til vedkommende alle aktuelle opplysninger.</BodyLong>
                <div>
                    <Heading as='h3' size='small'>
                        Dette kan du gjøre
                    </Heading>
                    <Box marginBlock='space-16' asChild>
                        <List as='ul'>
                            <List.Item>
                                Ta kontakt med din lokale identansvarlig. Dette er vanligvis enhetens leder.
                            </List.Item>
                        </List>
                    </Box>
                </div>
            </Box>
        );
    }

    return (
        <Box>
            <Heading level='2' size='small'>
                Hva må ordnes før personen kan registreres?
            </Heading>
            <BodyLong spacing>Personen kan ikke registreres før registerdata er oppdatert.</BodyLong>
            <div>
                <Heading as='h3' size='small'>
                    Dette kan du gjøre
                </Heading>
                <Box marginBlock='space-16' asChild>
                    <List as='ul'>
                        {tiltaksliste.map((tiltak) => (
                            <List.Item key={tiltak.id}>{tiltak.beskrivelse}</List.Item>
                        ))}
                    </List>
                </Box>
            </div>
        </Box>
    );
}

export default AarsakerTilAtPersonenIkkeKanRegistreres;
