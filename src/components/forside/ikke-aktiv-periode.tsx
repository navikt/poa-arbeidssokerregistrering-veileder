import { Alert, BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import { SamletInformasjon } from '@navikt/arbeidssokerregisteret-utils';
import { useRouter } from 'next/router';

import { prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';
import HistorikkLenke from './historikk-lenke';
import { mapUtfoertAvType } from './mapUtfoertAvType';
import { oversettSluttaarsak } from '../../lib/oversett-sluttaarsak';

interface Props {
    samletInformasjon: SamletInformasjon;
}

function IkkeAktivPeriode(props: Props) {
    const { samletInformasjon } = props;
    const router = useRouter();

    const harOpplysninger = samletInformasjon?.opplysningerOmArbeidssoeker.length > 0;
    const sluttaarsak = oversettSluttaarsak('nb');

    return (
        <>
            <Alert variant="warning">Personen er ikke registrert som arbeidssøker</Alert>
            <Box className={'mt-4'}>
                {harOpplysninger ? (
                    <>
                        <Heading level={'3'} size={'medium'}>
                            Sist registrert som arbeidssøker
                        </Heading>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Arbeidssøkerperioden ble avsluttet{' '}
                            {prettyPrintDatoOgKlokkeslett(
                                samletInformasjon.arbeidssoekerperioder[0]?.avsluttet.tidspunkt,
                            )}{' '}
                            av {mapUtfoertAvType(samletInformasjon.arbeidssoekerperioder[0]?.avsluttet.utfoertAv.type)}
                        </BodyShort>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Sluttårsak:{' '}
                            {sluttaarsak(
                                samletInformasjon.arbeidssoekerperioder[0]?.avsluttet.aarsak ?? 'fortsatt aktiv',
                            )}
                        </BodyShort>

                        <HistorikkLenke />
                    </>
                ) : (
                    <Heading level={'3'} size={'medium'}>
                        Har ikke vært registrert som arbeidssøker
                    </Heading>
                )}
            </Box>
            <Box className={'mt-4'}>
                <Button variant="secondary" onClick={() => router.push('/registrering-arbeidssoeker-sjekk')}>
                    Start registrering som arbeidssøker
                </Button>
            </Box>
        </>
    );
}

export default IkkeAktivPeriode;
