import { Box, Heading } from '@navikt/ds-react';

interface OpplysningerOmArbeidssoekerProps {
    sisteOpplysningerOmArbeidssoeker: any;
}

function OpplysningerOmArbeidssoeker(props: OpplysningerOmArbeidssoekerProps) {
    const { sisteOpplysningerOmArbeidssoeker } = props || {};

    if (!sisteOpplysningerOmArbeidssoeker) return null;

    return (
        <Box>
            <Heading level="1" size="small">
                Opplysninger om arbeidssøker
            </Heading>
        </Box>
    );
}

export default OpplysningerOmArbeidssoeker;
