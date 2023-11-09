import { useEffect } from 'react';
import { BodyLong, Heading, Alert } from '@navikt/ds-react';

import useSprak from '../hooks/useSprak';

import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import { loggAktivitet, loggFlyt } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Personen er nå registrert som arbeidssøker',
        dagpenger:
            'Hvis personen har registrert seg for å søke dagpenger må du informere om at en tidligst kan få dagpenger fra den dagen en sender inn søknaden.',
    },
};

const Kvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    useEffect(() => {
        loggAktivitet({
            aktivitet: 'Viser kvittering',
        });
        loggFlyt({ hendelse: 'Registrering fullført' });
    }, []);

    return (
        <Alert variant="success">
            <Heading level="1" size={'large'} className={'mbl'}>
                {tekst('header')}
            </Heading>
            <BodyLong>{tekst('dagpenger')}</BodyLong>
        </Alert>
    );
};

export const getServerSideProps = withAuthenticatedPage();
export default Kvittering;