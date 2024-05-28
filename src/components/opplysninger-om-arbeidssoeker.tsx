import { BodyLong, Box, Heading } from '@navikt/ds-react';
import OpplysningerOmArbeidssokerKomponent from './opplysninger-om-arbeidssoker-komponent';

interface OpplysningerOmArbeidssoekerProps {
    sisteOpplysningerOmArbeidssoeker: any;
    behovsvurdering: any;
}

function OpplysningerOmArbeidssoeker(props: OpplysningerOmArbeidssoekerProps) {
    const { sisteOpplysningerOmArbeidssoeker, behovsvurdering } = props || {};
    const harOpplysninger = sisteOpplysningerOmArbeidssoeker?.opplysningerOmArbeidssoekerId;

    return (
        <Box>
            <Heading level="1" size="small">
                Opplysninger om arbeidssøker
            </Heading>
            {harOpplysninger ? (
                <OpplysningerOmArbeidssokerKomponent
                    opplysninger={sisteOpplysningerOmArbeidssoeker}
                    behovsvurdering={behovsvurdering}
                />
            ) : (
                <BodyLong spacing>Det finnes ingen opplysninger knyttet til registreringen.</BodyLong>
            )}
        </Box>
    );
}

export default OpplysningerOmArbeidssoeker;
