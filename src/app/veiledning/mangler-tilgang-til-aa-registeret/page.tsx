import { lagHentTekstForSprak, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import TilbakeTilForside from '../../../components/tilbake-til-forside';
import { TrackPageView } from '../../components/TrackPageView';

const TEKSTER: Tekster<string> = {
    nb: {
        overskrift: 'Du har ikke tilgang til personens arbeidsforhold',
        melding: 'Årsak til feilen kan være manglende lesetilgang til AA registret.',
        kontakt: 'Ta kontakt med din lokale identansvarlige. Dette er vanligvis enhetens leder.',
    },
};

export default function SperretPage() {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <>
            <TrackPageView data={{ viser: 'mangler tilgang til aa-registeret' }} />
            <TilbakeTilForside sidenavn={'Mangler tilgang'} />
            <Alert variant='warning'>
                <Heading spacing size='small' level='1'>
                    {tekst('overskrift')}
                </Heading>
                <BodyLong>{tekst('melding')}</BodyLong>
                <BodyLong>{tekst('kontakt')}</BodyLong>
            </Alert>
        </>
    );
}
