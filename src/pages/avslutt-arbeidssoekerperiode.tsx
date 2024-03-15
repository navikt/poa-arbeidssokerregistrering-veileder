import { useEffect } from 'react';
import { Alert, BodyLong, Box, Heading, List } from '@navikt/ds-react';
import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';

import useSprak from '../hooks/useSprak';

import { loggVisning } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import StoppPeriodeKnapp from '../components/stopp-periode-knapp';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Når bør du ikke avslutte en arbeidssøkerperiode?',
        informasjon: 'Avslutt arbeidssøkerperioden hvis personen ikke skal være arbeidssøker',
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
        <Alert variant="warning">
            <Heading level="1" size="small" className={'mbl'}>
                {tekst('header')}
            </Heading>
            <List as="ul" className="mb-8">
                <List.Item>personen mottar ytelser fra NAV som krever at du er registrert som arbeidssøker</List.Item>
                <List.Item>personen mottar tjenester fra NAV som krever at du er registrert som arbeidssøker</List.Item>
                <List.Item>personen ønsker å stå registrert som arbeidssøker</List.Item>
            </List>
            <Heading level="2" size="small" className="mb-8 mt-4">
                {tekst('informasjon')}
            </Heading>
            <StoppPeriodeKnapp />
        </Alert>
    );
};

export const getServerSideProps = withAuthenticatedPage();

export default AvsluttArbeidssoekerperiode;
