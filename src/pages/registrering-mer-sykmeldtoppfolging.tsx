import { useEffect } from 'react';
import { Heading, Alert, BodyShort } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';

import { SykmeldtoppfolgingProvider } from '../contexts/sykmeldtoppfolging-context';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import DemoPanel from '../components/demo-panel';
import SykmeldtFremtidigSituasjon from '../components/skjema/sykmeldt-fremtidig-situasjon';
import TilbakeTilJobb from '../components/skjema/sykmeldt-tilbake-til-jobb';
import SkalTilbakeTilJobb from '../components/skjema/sykmeldt-skal-tilbake-til-jobb';
import Utdanning from '../components/skjema/sykmeldt-utdanning';
import UtdanningGodkjent from '../components/skjema/sykmeldt-utdanning-godkjent';
import UtdanningBestatt from '../components/skjema/sykmeldt-utdanning-bestatt';
import AndreProblemer from '../components/skjema/sykmeldt-andre-problemer';
import { RegistrerForMerSykmeldtoppfolgingKnapp } from '../components/skjema/sykmeldt-registrer-knapp';
import { loggFlyt } from '../lib/amplitude';
import HvaErNytt from '../components/hva-er-nytt';

export default function RegistreringMerSykmeldtOppfolging() {
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const visInnhold = fnr && enhetId;

    useEffect(() => {
        loggFlyt({ hendelse: 'Starter registrering for mer sykmeldtoppfølging' });
    }, []);

    return (
        <>
            <ManglerPersonEllerEnhet />
            {visInnhold && (
                <>
                    <Heading size="medium" level="1" className="mb-8">
                        Registrering for mer sykmeldtoppfølging
                    </Heading>
                    <HvaErNytt />
                    <Alert variant="info" className="mb-8">
                        <Heading level="1" size="small">
                            Personen kan registreres for mer sykmeldtoppfølging
                        </Heading>
                        <BodyShort>
                            Dersom personen skal registreres som arbeidssøker må du følge gjeldende servicerutiner for å
                            avslutte sykefraværsoppfølgingen.
                        </BodyShort>
                    </Alert>
                    <SykmeldtoppfolgingProvider>
                        <SykmeldtFremtidigSituasjon />
                        <TilbakeTilJobb />
                        <SkalTilbakeTilJobb />
                        <Utdanning />
                        <UtdanningGodkjent />
                        <UtdanningBestatt />
                        <AndreProblemer />
                        <RegistrerForMerSykmeldtoppfolgingKnapp />
                    </SykmeldtoppfolgingProvider>
                </>
            )}
            <DemoPanel />
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
