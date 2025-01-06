import { BodyLong, Box, Heading, Alert } from '@navikt/ds-react';
import OpplysningerOmArbeidssokerKomponent from './opplysninger-om-arbeidssoker-komponent';

interface OpplysningerOmArbeidssoekerProps {
    sisteOpplysningerOmArbeidssoeker: any;
    behovsvurdering: any;
    aktivPeriode: boolean;
}

function OpplysningerOmArbeidssoeker(props: OpplysningerOmArbeidssoekerProps) {
    const { sisteOpplysningerOmArbeidssoeker, behovsvurdering, aktivPeriode } = props || {};
    const harOpplysninger = sisteOpplysningerOmArbeidssoeker?.opplysningerOmArbeidssoekerId;

    return (
        <Box>
            {harOpplysninger ? (
                <>
                    <Heading level="1" size="small">
                        Opplysninger om arbeidssøker
                    </Heading>
                    <OpplysningerOmArbeidssokerKomponent
                        opplysninger={sisteOpplysningerOmArbeidssoeker}
                        behovsvurdering={behovsvurdering}
                        aktivPeriode={aktivPeriode}
                    />
                </>
            ) : (
                <Alert variant="warning" className="mb-4">
                    <Heading size="small" level="1">
                        Det finnes ingen opplysninger for nåværende arbeidssøkerperiode
                    </Heading>
                    <BodyLong>Vennligst legg til opplysninger om arbeidssøkersituasjonen.</BodyLong>
                </Alert>
            )}
        </Box>
    );
}

export default OpplysningerOmArbeidssoeker;
