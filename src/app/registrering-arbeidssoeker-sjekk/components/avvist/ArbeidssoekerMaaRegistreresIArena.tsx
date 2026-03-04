import { BodyLong, Box, Heading, List } from '@navikt/ds-react';

/**
 * Instruksjoner for Arena-registrering.
 *
 * Vises kun når `RegistreringSjekk` har bestemt at personen må registreres i
 * Arena først (`klassifisering.maaRegistreresIArenaFoerst`).
 *
 * Ren presentasjonskomponent uten props — all synlighetslogikk styres av parent.
 */
function ArbeidssoekerMaaRegistreresIArena() {
    return (
        <Box className='mb-8'>
            <Heading level='3' size='small' className='navds-heading navds-heading--xsmall'>
                Trenger personen å være registrert i Arena?
            </Heading>
            <BodyLong>
                Hvis du ønsker at personen skal hentes inn i Arena må dette gjøres <strong>før</strong> personen
                registreres som arbeidssøker.
            </BodyLong>
            <Box marginBlock='space-12' asChild>
                <List data-aksel-migrated-v8 as='ol' size='small'>
                    <List.Item>Sjekk om personen allerede ligger i Arena</List.Item>
                    <List.Item>Registrer personen i Arena hvis hen ikke allerede er registrert der</List.Item>
                    <List.Item>Registrer personen som arbeidssøker</List.Item>
                </List>
            </Box>
        </Box>
    );
}

export default ArbeidssoekerMaaRegistreresIArena;
