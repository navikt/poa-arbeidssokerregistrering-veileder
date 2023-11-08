import { useEffect } from 'react';
import { BodyLong, GuidePanel, Heading, Link } from '@navikt/ds-react';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import useSprak from '../../hooks/useSprak';

import { loggStoppsituasjon } from '../../lib/amplitude';
import { useConfig } from '../../contexts/config-context';
import { Config } from '../../model/config';
import { withAuthenticatedPage } from '../../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        overskrift: 'Vi må hjelpe deg videre i andre kanaler',
        innledning: 'For at du skal få registrert deg som arbeidssøker må vi hjelpe deg videre.',
        sendMelding: 'Send melding til veilederen din',
        ringOss: 'eller ring oss på',
        telefonNummer: '55 55 33 33',
    },
    en: {
        overskrift: 'We will need to help you through other channels',
        innledning: 'You will need some assistance to register as a job seeker',
        sendMelding: 'Send a message to your counselor',
        ringOss: 'or call',
        telefonNummer: '55 55 33 33',
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
        <GuidePanel poster>
            <Heading spacing size="large" level="1">
                {tekst('overskrift')}
            </Heading>
            <BodyLong>{tekst('innledning')}</BodyLong>
            <BodyLong>
                <Link href={dialogUrl}>{tekst('sendMelding')}</Link> {tekst('ringOss')} <b>{tekst('telefonNummer')}</b>
            </BodyLong>
        </GuidePanel>
    );
}

export const getServerSideProps = withAuthenticatedPage();
export default AlleredeRegistrert;
