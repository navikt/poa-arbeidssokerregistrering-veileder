import { Alert, BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';
import HistorikkLenke from './historikk-lenke';
import { mapUtfoertAvType } from './mapUtfoertAvType';
import { oversettSluttaarsak } from '../../lib/oversett-sluttaarsak';
import { AggregertPeriode } from '../../types/aggregerte-perioder';

interface Props {
    aggregertPeriode?: AggregertPeriode;
}

function IkkeAktivPeriode(props: Props) {
    const { aggregertPeriode } = props;
    const router = useRouter();

    const harHattPeriode = Boolean(aggregertPeriode);
    const sluttaarsak = oversettSluttaarsak('nb');

    return (
        <>
            <Alert variant="warning">Personen er ikke registrert som arbeidssøker</Alert>
            <Box className={'mt-4'}>
                {harHattPeriode ? (
                    <>
                        <Heading level={'3'} size={'medium'}>
                            Sist registrert som arbeidssøker
                        </Heading>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Arbeidssøkerperioden ble avsluttet{' '}
                            {prettyPrintDatoOgKlokkeslett(aggregertPeriode?.avsluttet.tidspunkt)} av{' '}
                            {mapUtfoertAvType(aggregertPeriode?.avsluttet.utfoertAv.type)}
                        </BodyShort>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Sluttårsak: {sluttaarsak(aggregertPeriode?.avsluttet.aarsak ?? 'fortsatt aktiv')}
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
