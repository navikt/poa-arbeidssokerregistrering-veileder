import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { TrackPageView } from '@/app/components/TrackPageView';
import TilbakeTilForside from '@/components/tilbake-til-forside';

export default function KvitteringOppdatertOpplysninger() {
    return (
        <>
            <TrackPageView data={{ viser: 'Kvittering for oppdatert opplysninger' }} />
            <TilbakeTilForside sidenavn='Kvittering oppdatert opplysninger' />
            <Alert variant='success'>
                <Heading level='1' size='small' className={'mbl'}>
                    Opplysningene er oppdatert
                </Heading>

                <BodyLong spacing>
                    Dersom de oppdaterte opplysningene kan ha konsekvenser for eventuell pengestøtte til arbeidssøkeren
                    må du opprette en &quot;vurder konsekvens for ytelse&quot; oppgave i Gosys
                </BodyLong>
            </Alert>
        </>
    );
}
