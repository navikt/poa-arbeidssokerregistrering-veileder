import { useEffect } from 'react';
import { BodyLong, Heading, Alert } from '@navikt/ds-react';
import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';

import useSprak from '../hooks/useSprak';

import { loggVisning } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import TilbakeTilForside from '../components/tilbake-til-forside';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Arbeidssøkerperioden er slettet',
        informasjon:
            'Dersom personen har behov for å være arbeidssøker igjen på et senere tidspunkt må hen registreres på nytt.',
        tillegg: 'Selv om perioden er slettet vil den fortsatt kunne vises i enkelte logger.',
    },
};

const ArbeidssoekerperiodenErSlettetKvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    useEffect(() => {
        loggVisning({
            viser: 'kvittering for slettet arbeidssøkerperiode',
        });
    }, []);

    return (
        <>
            <TilbakeTilForside sidenavn={'Arbeidssøkerperioden er slettet'} />

            <Alert variant="success">
                <Heading level="1" size="small" className={'mbl'}>
                    {tekst('header')}
                </Heading>
                <BodyLong spacing>{tekst('informasjon')}</BodyLong>
                <BodyLong>{tekst('tillegg')}</BodyLong>
            </Alert>
        </>
    );
};

export const getServerSideProps = withAuthenticatedPage();

export default ArbeidssoekerperiodenErSlettetKvittering;
