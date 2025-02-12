import { Alert, BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import LenkeTilHistorikk from '../lenke-til-historikk';
import { SamletInformasjon } from '@navikt/arbeidssokerregisteret-utils';
import { useRouter } from 'next/router';
import { prettyPrintDato, prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';

interface Props {
    samletInformasjon: SamletInformasjon;
}

function IkkeAktivPeriode(props: Props) {
    const { samletInformasjon } = props;
    const router = useRouter();

    const harOpplysninger = samletInformasjon?.opplysningerOmArbeidssoeker.length > 0;

    return (
        <>
            <Alert variant="warning">Personen er ikke registrert som arbeidssøker</Alert>
            {harOpplysninger ? (
                <div className={'mt-4'}>
                    <Heading level={'3'} size={'medium'}>
                        Sist registrert som arbeidssøker
                    </Heading>
                    <BodyShort textColor={'subtle'} size={'small'}>
                        {prettyPrintDatoOgKlokkeslett(
                            samletInformasjon.opplysningerOmArbeidssoeker[0]?.sendtInnAv.tidspunkt,
                        )}{' '}
                        av {samletInformasjon.opplysningerOmArbeidssoeker[0]?.sendtInnAv.utfoertAv.type}
                    </BodyShort>
                    <LenkeTilHistorikk harIngenArbeidssoekerperioder={true} />
                </div>
            ) : (
                <Heading level={'3'} size={'medium'} className={'mt-4'}>
                    Har ikke vært registrert som arbeidssøker
                </Heading>
            )}

            <Box className={'mt-4'}>
                <Button variant="secondary" onClick={() => router.push('/registrering-arbeidssoeker-sjekk')}>
                    Registrer som arbeidssøker
                </Button>
            </Box>
        </>
    );
}

export default IkkeAktivPeriode;
