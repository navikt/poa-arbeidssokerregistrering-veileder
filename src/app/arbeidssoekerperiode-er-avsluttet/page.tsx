import { lagHentTekstForSprak, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyLong } from '@navikt/ds-react';
import { Kvitteringsoverskrift } from '@/components/Kvitteringsoverskrift';
import { TrackPageView } from '@/components/TrackPageView';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';

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
                <Kvitteringsoverskrift>{tekst('header')}</Kvitteringsoverskrift>
                <BodyLong>{tekst('informasjon')}</BodyLong>
            </Alert>
        </>
    );
}
