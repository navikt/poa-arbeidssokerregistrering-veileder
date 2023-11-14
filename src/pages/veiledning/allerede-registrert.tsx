import { useEffect } from 'react';
import { BodyLong, Heading, Link, Alert } from '@navikt/ds-react';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import useSprak from '../../hooks/useSprak';

import { loggStoppsituasjon } from '../../lib/amplitude';
import { useConfig } from '../../contexts/config-context';
import { Config } from '../../model/config';
import { withAuthenticatedPage } from '../../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        overskrift: 'Personen er allerede registrert',
        melding: 'Personen er allerede registrert som arbeidssøker i Arena',
    },
};

function AlleredeRegistrert() {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    useEffect(() => {
        loggStoppsituasjon({
            situasjon: 'Arbeidssøkeren er allerede registrert',
        });
    }, []);

    const { dialogUrl } = useConfig() as Config;

    return (
        <Alert variant="warning">
            <Heading spacing size="small" level="1">
                {tekst('overskrift')}
            </Heading>
            <BodyLong>{tekst('melding')}.</BodyLong>
        </Alert>
    );
}

export const getServerSideProps = withAuthenticatedPage();
export default AlleredeRegistrert;
