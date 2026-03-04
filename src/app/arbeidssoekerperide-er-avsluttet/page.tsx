import { lagHentTekstForSprak, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import TilbakeTilForside from '@/components/tilbake-til-forside';
import { TrackPageView } from '../components/TrackPageView';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Arbeidssøkerperioden er avsluttet',
        informasjon:
            'Dersom personen har behov for å være arbeidssøker igjen på et senere tidspunkt må hen registreres på nytt.',
    },
};
export default function ArbeidssoekerperiodeErAvsluttetPage() {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <>
            <TrackPageView data={{ viser: 'kvittering for avsluttet arbeidssøkerperiode' }} />
            <TilbakeTilForside sidenavn={'Arbeidssøkerperioden er avsluttet'} />
            <Alert variant='success'>
                <Heading level='1' size='small' className={'mbl'}>
                    {tekst('header')}
                </Heading>
                <BodyLong>{tekst('informasjon')}</BodyLong>
            </Alert>
        </>
    );
}
