import { useEffect } from 'react';
import { BodyLong, Heading, Alert, Link } from '@navikt/ds-react';

import useSprak from '../hooks/useSprak';

import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import { loggAktivitet, loggVisning } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Personen er registrert som arbeidssøker',
        dagpenger:
            'Hvis personen har registrert seg for å søke dagpenger må du informere om at en tidligst kan få dagpenger fra den dagen en sender inn søknaden.',
    },
};

const Kvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    const gaarTilDagpenger = () => {
        loggAktivitet({ aktivitet: 'Går til skjema for dagpenger' });
    };

    useEffect(() => {
        loggVisning({
            viser: 'Kvittering for registrert arbeidssøker',
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
