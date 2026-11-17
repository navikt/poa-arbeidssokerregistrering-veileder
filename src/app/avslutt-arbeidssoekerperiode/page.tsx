import { lagHentTekstForSprak, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, Box, Heading, List } from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';
import { TrackPageView } from '@/components/TrackPageView';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { AvsluttPeriode } from './components/AvsluttPeriode';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Når bør du ikke avslutte en arbeidssøkerperiode?',
        informasjon: 'Avslutt arbeidssøkerperioden hvis personen ikke skal være arbeidssøker lenger',
    },
};

export default function AvsluttArbeidssoekerperiodePage() {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <>
            <TrackPageView data={{ viser: 'siden for å avslutte en arbeidssøkerperiode' }} />
            <TilbakeTilForside sidenavn={'Avslutt arbeidssøkerperiode'} />
            <Alert variant='info'>
                <Heading level='1' size='small'>
                    {tekst('header')}
                </Heading>
                <Box marginBlock='space-0 space-32'>
                    <Box marginBlock='space-16' asChild>
                        <List data-aksel-migrated-v8 as='ul'>
                            <ListItem>
                                personen mottar pengestøtte fra NAV som krever at du er registrert som arbeidssøker
                            </ListItem>
                            <ListItem>
                                personen mottar tjenester fra NAV som krever at du er registrert som arbeidssøker
                            </ListItem>
                            <ListItem>personen ønsker å stå registrert som arbeidssøker</ListItem>
                        </List>
                    </Box>
                </Box>
                <Box marginBlock='space-16 space-32'>
                    <Heading level='2' size='small'>
                        {tekst('informasjon')}
                    </Heading>
                </Box>
            </Alert>
            <Box marginBlock='space-16 space-0'>
                <AvsluttPeriode />
            </Box>
        </>
    );
}
