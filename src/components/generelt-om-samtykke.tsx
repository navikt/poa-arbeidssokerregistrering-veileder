import { Box, List, Heading } from '@navikt/ds-react';

function GenereltOmSamtykke() {
    return (
        <Box className="mb-8" borderWidth="1" padding="4" style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <div>
                <Heading as="h3" size="xsmall">
                    Før du registrerer arbeidssøkeren må du sørge for at:
                </Heading>
                <Box marginBlock="space-12" asChild>
                    <List data-aksel-migrated-v8 as="ul" size="small">
                        <List.Item>
                            Personen som skal registreres er informert og har samtykket til registreringen
                        </List.Item>
                        <List.Item>
                            Det er gitt informasjon om at den registrerte må bekrefte arbeidssøkerstatusen hver 14. dag.
                        </List.Item>
                    </List>
                </Box>
            </div>
        </Box>
    );
}

export default GenereltOmSamtykke;
