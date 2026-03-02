import { lagHentTekstForSprak, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyLong, Heading, Link } from '@navikt/ds-react';
import TilbakeTilForside from '@/components/tilbake-til-forside';
import { TrackAktivitet } from '../components/TrackAktivitet';
import { TrackPageView } from '../components/TrackPageView';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Personen er registrert som arbeidssøker',
        dagpenger:
            'Hvis personen har registrert seg for å søke dagpenger må du informere om at en tidligst kan få dagpenger fra den dagen en sender inn søknaden.',
    },
};

export default function KvitteringArbeidssokerPage() {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <>
            <TrackPageView data={{ viser: 'Kvittering for registrert arbeidssøker' }} />
            <TilbakeTilForside sidenavn='Kvittering' />
            <Alert variant='success'>
                <Heading level='1' size='small' className={'mbl'}>
                    {tekst('header')}
                </Heading>
                <BodyLong>
                    {tekst('dagpenger')}{' '}
                    <TrackAktivitet data={{ aktivitet: 'Går til skjema for dagpenger' }}>
                        <Link href='https://www.nav.no/start/soknad-dagpenger?stegvalg=1'>
                            Uinnlogget dagpengesøknad og papirsøknad finner du her.
                        </Link>
                    </TrackAktivitet>
                </BodyLong>
            </Alert>
        </>
    );
}
