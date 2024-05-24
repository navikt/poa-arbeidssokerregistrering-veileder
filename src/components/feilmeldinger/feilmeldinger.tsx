import { useEffect } from 'react';
import { Alert, BodyLong, Button, Heading, Link } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useErrorContext } from '../../contexts/error-context';

import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { loggVisning } from '../../lib/amplitude';
import TilbakeTilForside from '../tilbake-til-forside';

const TEKSTER: Tekster<string> = {
    nb: {
        feilISystemene: 'På grunn av feil i systemene får du ikke registrert denne personen nå.',
        provIgjen: 'Vennligst prøv igjen litt senere.',
        kontaktBrukerstotte: 'Kontakt teknisk brukerstøtte dersom problemene vedvarer.',
    },
};

const FeilmeldingGenerell = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    useEffect(() => {
        loggVisning({ viser: 'generell feilmelding' });
    }, []);

    return (
        <>
            <TilbakeTilForside sidenavn={'Feil i system'} />
            <Alert variant={'error'}>
                <Heading size="small" level="1">
                    Beklager, teknisk feil
                </Heading>
                <BodyLong>{tekst('feilISystemene')}</BodyLong>
                <BodyLong>{tekst('provIgjen')}</BodyLong>
                <BodyLong>{tekst('kontaktBrukerstotte')}</BodyLong>
            </Alert>
        </>
    );
};

const GlobalFeilmelding = () => {
    const { error, setError } = useErrorContext();
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    if (!error) {
        return null;
    }

    return (
        <>
            <TilbakeTilForside sidenavn={'Feil i system'} />
            <Alert variant={'error'}>
                <BodyLong spacing>{tekst('feilISystemene')}</BodyLong>
                <BodyLong spacing>{tekst('provIgjen')}</BodyLong>
                <BodyLong spacing>
                    <Link href="https://www.nav.no/kontaktoss">{tekst('kontaktBrukerstotte')}</Link>
                </BodyLong>
                <BodyLong>
                    <Button variant={'secondary'} onClick={() => setError(null)}>
                        Lukk
                    </Button>
                </BodyLong>
            </Alert>
        </>
    );
};

export { FeilmeldingGenerell, GlobalFeilmelding };
