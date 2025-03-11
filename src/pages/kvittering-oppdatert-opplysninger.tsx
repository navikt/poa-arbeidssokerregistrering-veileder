import { useEffect } from 'react';
import { BodyLong, Heading, Alert, Link } from '@navikt/ds-react';

import useSprak from '../hooks/useSprak';

import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { loggAktivitet, loggVisning } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import TilbakeTilForside from '../components/tilbake-til-forside';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Opplysningene er oppdatert',
    },
};

const Kvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    useEffect(() => {
        loggVisning({
            viser: 'Kvittering for oppdatert opplysninger',
        });
    }, []);

    return (
        <>
            <TilbakeTilForside sidenavn="Kvittering oppdatert opplysninger" />
            <Alert variant="success">
                <Heading level="1" size="small" className={'mbl'}>
                    {tekst('header')}
                </Heading>

                <BodyLong spacing>
                    Dersom de oppdaterte opplysningene kan ha konsekvenser for eventuell pengestøtte til arbeidssøkeren
                    må du opprette en &quot;vurder konsekvens for ytelse&quot; oppgave i Gosys
                </BodyLong>
            </Alert>
        </>
    );
};

export const getServerSideProps = withAuthenticatedPage();
export default Kvittering;
