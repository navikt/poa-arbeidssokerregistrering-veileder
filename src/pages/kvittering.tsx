import React from 'react';
import { BodyLong, GuidePanel, Heading, Link } from '@navikt/ds-react';

import useSprak from '../hooks/useSprak';

import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import { loggAktivitet, loggFlyt } from '../lib/amplitude';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { withAuthenticatedPage } from '../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Du er nå registrert som arbeidssøker',
        dagpengerTittel: 'Har du søkt om dagpenger?',
        permittert: 'Er du permittert eller arbeidsledig må du søke om dagpenger i egen søknad.',
        tidligstFaaDagpenger: 'Du kan tidligst få dagpenger fra den dagen du sender søknaden.',
        sendeSoknaden:
            'For å ikke tape dager med dagpenger må du sende søknaden senest samme dag som du ønsker dagpenger fra.',
        sokDagpenger: 'Søk dagpenger',
        skalIkkeSoke: 'Skal ikke søke nå',
    },
};

const Kvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    React.useEffect(() => {
        loggAktivitet({
            aktivitet: 'Viser kvittering',
        });
        loggFlyt({ hendelse: 'Registrering fullført' });
    }, []);

    const { dagpengesoknadUrl, dittNavUrl } = useConfig() as Config;

    return (
        <>
            <Heading level="1" size={'large'} className={'mbl'}>
                {tekst('header')}
            </Heading>
            <GuidePanel poster>
                <Heading level={'2'} size={'medium'} className={'mbm'}>
                    {tekst('dagpengerTittel')}
                </Heading>
                <BodyLong>{tekst('permittert')}</BodyLong>
                <BodyLong>{tekst('tidligstFaaDagpenger')}</BodyLong>
                <BodyLong>{tekst('sendeSoknaden')}</BodyLong>
            </GuidePanel>
            <a
                href={dagpengesoknadUrl}
                onClick={() =>
                    loggAktivitet({
                        aktivitet: 'Går til dagpenger fra kvittering',
                    })
                }
                className="mhl navds-button navds-button--primary navds-button--medium"
            >
                {tekst('sokDagpenger')}
            </a>
            <Link
                href={dittNavUrl}
                onClick={() =>
                    loggAktivitet({
                        aktivitet: 'Velger å ikke gå til dagpenger fra kvittering',
                    })
                }
            >
                {tekst('skalIkkeSoke')}
            </Link>
        </>
    );
};

export const getServerSideProps = withAuthenticatedPage();
export default Kvittering;
