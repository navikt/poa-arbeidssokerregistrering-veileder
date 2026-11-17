import { lagHentTekstForSprak, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, Box, Heading, List } from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';
import { SlettPeriode } from '@/app/slett-arbeidssoekerperiode/components/SlettPeriode';
import { TrackPageView } from '@/components/TrackPageView';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Når bør du ikke slette en arbeidssøkerperiode?',
        informasjon: 'Slett arbeidssøkerperioden bare hvis den er startet ved en feil',
    },
};

export default function SlettArbeidssoekerperiodePage() {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    return (
        <>
            <TrackPageView data={{ viser: 'siden for å slette en arbeidssøkerperiode' }} />
            <TilbakeTilForside sidenavn={'Slett arbeidssøkerperiode'} />
            <Alert variant='warning'>
                <Heading level='1' size='small'>
                    {tekst('header')}
                </Heading>
                <Box marginBlock='space-32'>
                    <Box marginBlock='space-16' asChild>
                        <List data-aksel-migrated-v8 as='ul'>
                            <ListItem>
                                personen mottar pengestøtte fra NAV som krever at du er registrert som arbeidssøker
                            </ListItem>
                            <ListItem>
                                personen mottar tjenester fra NAV som krever at du er registrert som arbeidssøker
                            </ListItem>
                            <ListItem>personen ønsker å stå registrert som arbeidssøker</ListItem>
                            <ListItem>personen ikke er registrert ved en feiltagelse</ListItem>
                        </List>
                    </Box>
                </Box>
                <Box marginBlock='space-16 space-32'>
                    <Heading level='2' size='small'>
                        {tekst('informasjon')}
                    </Heading>
                </Box>
            </Alert>
            <Box marginBlock='space-16'>
                <SlettPeriode />
            </Box>
        </>
    );
}
