import { useEffect } from 'react';
import { BodyLong, Heading, Alert } from '@navikt/ds-react';
import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';

import useSprak from '../hooks/useSprak';

import { loggVisning } from '../lib/tracking';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import TilbakeTilForside from '../components/tilbake-til-forside';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Arbeidssøkerperioden er avsluttet',
        informasjon:
            'Dersom personen har behov for å være arbeidssøker igjen på et senere tidspunkt må hen registreres på nytt.',
    },
};

const ArbeidssoekerperiodenErAvsluttetKvittering = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    useEffect(() => {
        loggVisning({
            viser: 'kvittering for avsluttet arbeidssøkerperiode',
        });
    }, []);

    return (
        <>
            <TilbakeTilForside sidenavn={'Arbeidssøkerperioden er avsluttet'} />

            <Alert variant="success">
                <Heading level="1" size="small" className={'mbl'}>
                    {tekst('header')}
                </Heading>
                <BodyLong>{tekst('informasjon')}</BodyLong>
            </Alert>
        </>
    );
};

export const getServerSideProps = withAuthenticatedPage();

export default ArbeidssoekerperiodenErAvsluttetKvittering;
