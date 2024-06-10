import React, { useEffect } from 'react';
import { Heading, HStack } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';

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
import { loggFlyt } from '../lib/amplitude';
import HvaErNytt from '../components/hva-er-nytt';
import TilbakeTilForside from '../components/tilbake-til-forside';
import AvbrytKnapp from '../components/skjema/avbryt-knapp';

export default function RegistreringArbeidssoker() {
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const visInnhold = fnr && enhetId;

    useEffect(() => {
        loggFlyt({ hendelse: 'Starter registrering av arbeidssøker' });
    }, []);
    return (
        <>
            <ManglerPersonEllerEnhet />
            {visInnhold && (
                <>
                    <TilbakeTilForside sidenavn="Arbeidssøkerregistrering" />
                    <Heading size="medium" level="1" className="mb-8">
                        Arbeidssøkerregistrering
                    </Heading>
                    <HvaErNytt />
                    <RegistreringProvider>
                        <DinSituasjon />
                        <SisteJobb />
                        <UtdanningsNiva />
                        <Helseproblemer />
                        <AndreProblemer />

                        <HStack style={{ justifyContent: 'space-between' }}>
                            <AvbrytKnapp />
                            <OppdaterOpplysningerKnapp erRegistreringsKnapp />
                        </HStack>
                    </RegistreringProvider>
                </>
            )}
            <DemoPanel />
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
