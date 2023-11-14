import { useEffect } from 'react';
import { BodyLong, Heading, Link, Alert } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useConfig } from '../../contexts/config-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { loggStoppsituasjon } from '../../lib/amplitude';
import { Config } from '../../model/config';
import { withAuthenticatedPage } from '../../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        overskrift: 'Personen kan ikke registreres som arbeidssøker',
        melding: 'For å kunne gjennomføre en registrering må det gjøres endringer i personens status i Arena.',
    },
};

function Sperret() {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    useEffect(() => {
        loggStoppsituasjon({
            situasjon: 'Arbeidssøkeren er sperret for registrering',
        });
    }, []);

    const { dialogUrl } = useConfig() as Config;

    return (
        <Alert variant="warning">
            <Heading spacing size="small" level="1">
                {tekst('overskrift')}
            </Heading>
            <BodyLong>{tekst('melding')}</BodyLong>
        </Alert>
    );
}

export const getServerSideProps = withAuthenticatedPage();
export default Sperret;
