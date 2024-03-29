import { useEffect } from 'react';
import { BodyLong, Heading, Alert } from '@navikt/ds-react';

import useSprak from '../hooks/useSprak';

import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { loggAktivitet, loggVisning } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Personen er registrert for mer sykmeldtoppfølging',
        dagpenger:
            'Hvis personen skal søke om økonomisk støtte etter at retten til sykepenger tar slutt, må du informere om at det gjøres i en egen søknad.',
    },
};

const Kvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    useEffect(() => {
        loggVisning({
            viser: 'kvittering for mer sykmeldtoppfølging',
        });
    }, []);

    return (
        <Alert variant="success">
            <Heading level="1" size="small" className={'mbl'}>
                {tekst('header')}
            </Heading>
            <BodyLong>{tekst('dagpenger')}</BodyLong>
        </Alert>
    );
};

export const getServerSideProps = withAuthenticatedPage();
export default Kvittering;
