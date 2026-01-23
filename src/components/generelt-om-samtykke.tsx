import { Box, List } from '@navikt/ds-react';

function GenereltOmSamtykke() {
    return (
        <Box className="mb-8" borderWidth="1" padding="4" style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <List as="ul" size="small" title="Før du registrerer arbeidssøkeren må du sørge for at:">
                <List.Item>Personen som skal registreres er informert og har samtykket til registreringen</List.Item>
                <List.Item>
                    Det er gitt informasjon om at den registrerte må bekrefte arbeidssøkerstatusen hver 14. dag.
                </List.Item>
            </List>
        </Box>
    );
}

export default GenereltOmSamtykke;
