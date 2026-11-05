import { lagHentTekstForSprak, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyLong } from '@navikt/ds-react';
import { Kvitteringsoverskrift } from '@/components/Kvitteringsoverskrift';
import { TrackPageView } from '@/components/TrackPageView';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';

const TEKSTER: Tekster<string> = {
    nb: {
        header: 'Arbeidssøkerperioden er slettet',
        informasjon:
            'Dersom personen har behov for å være arbeidssøker igjen på et senere tidspunkt må hen registreres på nytt.',
        tillegg: 'Selv om perioden er slettet vil den fortsatt kunne vises i enkelte logger.',
    },
};
export default function ArbeidssoekerperiodeErSlettetPage() {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <>
            <TrackPageView data={{ viser: 'kvittering for slettet arbeidssøkerperiode' }} />
            <TilbakeTilForside sidenavn={'Arbeidssøkerperioden er slettet'} />
            <Alert variant='success'>
                <Kvitteringsoverskrift>{tekst('header')}</Kvitteringsoverskrift>
                <BodyLong spacing>{tekst('informasjon')}</BodyLong>
                <BodyLong>{tekst('tillegg')}</BodyLong>
            </Alert>
        </>
    );
}
