import React, { useEffect } from 'react';
import { Heading, HStack } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useFeatureToggles } from '../contexts/featuretoggle-context';

import { RegistreringProvider } from '../contexts/registrering-context';
import DinSituasjon from '../components/skjema/din-situasjon';
import SisteJobb from '../components/skjema/siste-jobb/siste-jobb';
import UtdanningsNiva from '../components/skjema/utdanning';
import Helseproblemer from '../components/skjema/helseproblemer';
import AndreProblemer from '../components/skjema/andre-problemer';
import { OppdaterOpplysningerKnapp } from '../components/skjema/oppdater-opplysninger-knapp';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import DemoPanel from '../components/demo-panel';
import { loggFlyt } from '../lib/tracking';
import { useSearchParams } from 'next/navigation';
import TilbakeTilForside from '../components/tilbake-til-forside';
import AvbrytKnapp from '../components/skjema/avbryt-knapp';

export default function OppdaterOpplysninger() {
    const { params } = useParamsFromContext();
    const { toggles } = useFeatureToggles();
    const { fnr, enhetId } = params;
    const visInnhold = fnr && enhetId;
    const searchParams = useSearchParams();
    const periodeId = searchParams.get('periodeId');
    useEffect(() => {
        loggFlyt({ hendelse: 'Starter registrering av arbeidssøker' });
    }, []);

    return (
        <>
            <ManglerPersonEllerEnhet />
            {visInnhold && (
                <>
                    <TilbakeTilForside sidenavn="Oppdater opplysninger" />
                    <Heading size="medium" level="1" className="mb-8">
                        Oppdater opplysniger
                    </Heading>
                    <RegistreringProvider hentTidligereOpplysningerForPeriodeId={periodeId}>
                        <DinSituasjon />
                        <SisteJobb />
                        <UtdanningsNiva />
                        <Helseproblemer />
                        <AndreProblemer />
                        <HStack style={{ justifyContent: 'space-between' }}>
                            <AvbrytKnapp />
                            <OppdaterOpplysningerKnapp erForhaandsgodkjent={false} />
                        </HStack>
                    </RegistreringProvider>
                </>
            )}
            <DemoPanel />
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
