import { Box, List, Heading } from '@navikt/ds-react';

interface AarsakerProps {
    feilmelding?: any;
}

function AarsakerTilStopp(props: AarsakerProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const { regel } = aarsakTilAvvisning || {};

    if (!regel) return null;

    return (
        <Box>
            <Heading level="2" size="small">
                Hva må ordnes før personen kan registreres?
            </Heading>
            <List as="ul" title="Dette kan du gjøre for å få registrert personen">
                <List.Item>Her er en ting å gjøre</List.Item>
                <List.Item>Her er en annen ting å gjøre</List.Item>
            </List>
        </Box>
    );
}

export default AarsakerTilStopp;
