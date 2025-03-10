import { useEffect } from 'react';
import { Alert, Heading, List } from '@navikt/ds-react';
import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';

import useSprak from '../hooks/useSprak';

import { loggVisning } from '../lib/amplitude';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import SlettPeriodeKnapp from '../components/slett-periode-knapp';
import TilbakeTilForside from '../components/tilbake-til-forside';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Når bør du ikke slette en arbeidssøkerperiode?',
        informasjon: 'Slett arbeidssøkerperioden hvis den er startet ved en feil',
    },
};

const SlettArbeidssoekerperiode = () => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    useEffect(() => {
        loggVisning({
            viser: 'siden for å slette en arbeidssøkerperiode',
        });
    }, []);

    return (
        <>
            <TilbakeTilForside sidenavn={'Slett arbeidssøkerperiode'} />
            <Alert variant="warning">
                <Heading level="1" size="small" className={'mbl'}>
                    {tekst('header')}
                </Heading>
                <List as="ul" className="mb-8">
                    <List.Item>
                        personen mottar pengestøtte fra NAV som krever at du er registrert som arbeidssøker
                    </List.Item>
                    <List.Item>
                        personen mottar tjenester fra NAV som krever at du er registrert som arbeidssøker
                    </List.Item>
                    <List.Item>personen ønsker å stå registrert som arbeidssøker</List.Item>
                    <List.Item>personen ikke er registrert ved en feiltagelse</List.Item>
                </List>
                <Heading level="2" size="small" className="mb-8 mt-4">
                    {tekst('informasjon')}
                </Heading>
                <SlettPeriodeKnapp />
            </Alert>
        </>
    );
};

export const getServerSideProps = withAuthenticatedPage();

export default SlettArbeidssoekerperiode;
