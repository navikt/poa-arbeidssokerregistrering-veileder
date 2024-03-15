import { useEffect } from 'react';
import { BodyLong, Box, Heading } from '@navikt/ds-react';
import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';

import useSprak from '../hooks/useSprak';

import { loggVisning } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import StoppPeriodeKnapp from '../components/stopp-periode-knapp';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Avslutt arbeidssøkerperioden',
        informasjon: 'Avslutt arbeidssøkerperioden dersom personen ikke lenger skal være arbeidssøker.',
    },
};

const AvsluttArbeidssoekerperiode = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    useEffect(() => {
        loggVisning({
            viser: 'siden for å avslutte en arbeidssøkerperiode',
        });
    }, []);

    return (
        <Box>
            <Heading level="1" size="small" className={'mbl'}>
                {tekst('header')}
            </Heading>
            <BodyLong spacing>{tekst('informasjon')}</BodyLong>
            <StoppPeriodeKnapp />
        </Box>
    );
};

export const getServerSideProps = withAuthenticatedPage();

export default AvsluttArbeidssoekerperiode;
