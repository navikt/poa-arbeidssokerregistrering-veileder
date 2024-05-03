import { BodyLong, Box, Heading } from '@navikt/ds-react';
import OpplysningerOmArbeidssokerKomponent from './opplysninger-om-arbeidssoker-komponent';

interface OpplysningerOmArbeidssoekerProps {
    sisteOpplysningerOmArbeidssoeker: any;
    behovsvurdering: any;
}

function OpplysningerOmArbeidssoeker(props: OpplysningerOmArbeidssoekerProps) {
    const { sisteOpplysningerOmArbeidssoeker, behovsvurdering } = props || {};

    if (!sisteOpplysningerOmArbeidssoeker) return null;

    return (
        <Box>
            <Heading level="1" size="small">
                Opplysninger om arbeidssøker
            </Heading>
            <OpplysningerOmArbeidssokerKomponent
                sprak="nb"
                opplysninger={sisteOpplysningerOmArbeidssoeker}
                behovsvurdering={behovsvurdering}
            />
        </Box>
    );
}

export default OpplysningerOmArbeidssoeker;
