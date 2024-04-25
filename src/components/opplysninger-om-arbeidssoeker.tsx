import { BodyLong, Box, Heading } from '@navikt/ds-react';

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
            <BodyLong>{JSON.stringify(sisteOpplysningerOmArbeidssoeker)}</BodyLong>
        </Box>
    );
}

export default OpplysningerOmArbeidssoeker;
