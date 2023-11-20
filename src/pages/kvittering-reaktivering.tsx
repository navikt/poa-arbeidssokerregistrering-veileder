import { useEffect } from 'react';
import { BodyLong, Heading, Alert, Link } from '@navikt/ds-react';

import useSprak from '../hooks/useSprak';

import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import { loggAktivitet } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Personen er reaktivert som arbeidssøker',
        dagpenger:
            'Hvis personen har mottatt dagpenger før vedkommende falt ut må du informere om at dagpengene er stoppet og at det må søkes om gjenopptak.',
    },
};

const Kvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    const gaarTilDagpenger = () => {
        loggAktivitet({ aktivitet: 'Går til skjema for dagpenger' });
    };

    useEffect(() => {
        loggAktivitet({
            aktivitet: 'Viser kvittering for reaktivert arbeidssøker',
        });
    }, []);

    return (
        <Alert variant="success">
            <Heading level="1" size="small" className={'mbl'}>
                {tekst('header')}
            </Heading>
            <BodyLong>
                {tekst('dagpenger')}{' '}
                <Link href="https://www.nav.no/start/soknad-dagpenger?stegvalg=1" onClick={gaarTilDagpenger}>
                    Uinnlogget dagpengesøknad og papirsøknad finner du her.
                </Link>
            </BodyLong>
        </Alert>
    );
};

export const getServerSideProps = withAuthenticatedPage();
export default Kvittering;
