import { Box, Heading } from '@navikt/ds-react';

interface ArbeidssoekerperiodeStatusProps {
    sisteArbeidssoekerperiode: any;
}

function ArbeidssoekerperiodeStatus(props: ArbeidssoekerperiodeStatusProps) {
    const { sisteArbeidssoekerperiode } = props || {};

    if (!sisteArbeidssoekerperiode) return null;

    return (
        <Box>
            <Heading level="1" size="small">
                Arbeidssøkerstatus
            </Heading>
        </Box>
    );
}

export default ArbeidssoekerperiodeStatus;
