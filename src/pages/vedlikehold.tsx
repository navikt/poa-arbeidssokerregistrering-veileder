import { useEffect } from 'react';
import { Alert, BodyLong, Heading, Link } from '@navikt/ds-react';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import useSprak from '../hooks/useSprak';

import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import { fetcher } from '../lib/api-utils';
import { loggAktivitet } from '../lib/amplitude';

const TEKSTER: Tekster<string> = {
    nb: {
        heading: 'Registreringen er ikke tilgjengelig grunnet vedlikehold',
        vedlikehold:
            'Hvis en person skal registrere seg for å søke om dagpenger anbefaler vi at dagpengesøknaden fylles inn nå slik at personen ikke risikerer å miste dager med dagpenger. En kan tidligst få dagpenger fra den dagen man søker fra.',
        provIgjen: 'Vennligst prøv igjen litt senere.',
        dagpenger:
            'Hvis en person skal registrere seg for å søke om dagpenger anbefaler vi at dagpengesøknaden fylles inn nå slik at personen ikke risikerer å miste dager med dagpenger. En kan tidligst få dagpenger fra den dagen man søker fra.',
    },
};

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
function Vedlikehold() {
    const router = useRouter();
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { data: toggles } = useSWR('api/features/', fetcher, { refreshInterval: 60000 });

    const gaarTilDagpenger = () => {
        loggAktivitet({ aktivitet: 'Går til skjema for dagpenger' });
    };

    useEffect(() => {
        if (toggles) {
            const nedetidFeature = toggles.find((feature) => {
                return feature.name === 'arbeidssokerregistrering.nedetid';
            });

            if (nedetidFeature?.enabled === false && !brukerMock) {
                router.push('/');
            }
        }
    }, [router, toggles]);

    return (
        <Alert variant="error">
            <Heading level="1" size="small" spacing>
                {tekst('heading')}
            </Heading>
            <BodyLong spacing>{tekst('provIgjen')}</BodyLong>
            <BodyLong spacing>
                {tekst('dagpenger')}{' '}
                <Link href="https://www.nav.no/start/soknad-dagpenger?stegvalg=1" onClick={gaarTilDagpenger}>
                    Uinnlogget dagpengesøknad og papirsøknad finner du her.
                </Link>
            </BodyLong>
        </Alert>
    );
}

export default Vedlikehold;
