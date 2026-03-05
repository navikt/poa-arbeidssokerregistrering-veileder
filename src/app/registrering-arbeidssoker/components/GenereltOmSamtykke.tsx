import { Box, Heading, List } from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';

function GenereltOmSamtykke() {
    return (
        <Box className='mb-8' borderWidth='1' padding='space-16' style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <div>
                <Heading as='h3' size='xsmall'>
                    Før du registrerer arbeidssøkeren må du sørge for at:
                </Heading>
                <Box marginBlock='space-12' asChild>
                    <List data-aksel-migrated-v8 as='ul' size='small'>
                        <ListItem>
                            Personen som skal registreres er informert og har samtykket til registreringen
                        </ListItem>
                        <ListItem>
                            Det er gitt informasjon om at den registrerte må bekrefte arbeidssøkerstatusen hver 14. dag.
                        </ListItem>
                    </List>
                </Box>
            </div>
        </Box>
    );
}
export { GenereltOmSamtykke };
