import { useEffect } from 'react';
import { Alert, BodyShort, Heading, Link } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';

import { SykmeldtoppfolgingProvider } from '../contexts/sykmeldtoppfolging-context';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import DemoPanel from '../components/demo-panel';
import SykmeldtFremtidigSituasjon from '../components/skjema/sykmeldt-fremtidig-situasjon';
import TilbakeTilJobb from '../components/skjema/sykmeldt-tilbake-til-jobb';
import SkalTilbakeTilJobb from '../components/skjema/sykmeldt-skal-tilbake-til-jobb';
import Utdanning from '../components/skjema/sykmeldt-utdanning';
import AndreProblemer from '../components/skjema/sykmeldt-andre-problemer';
import { RegistrerForMerSykmeldtoppfolgingKnapp } from '../components/skjema/sykmeldt-registrer-knapp';
import { loggAktivitet, loggFlyt } from '../lib/amplitude';
import HvaErNytt from '../components/hva-er-nytt';

export default function RegistreringMerSykmeldtOppfolging() {
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const visInnhold = fnr && enhetId;

    const gaarTilServicerutine = () => {
        loggAktivitet({ aktivitet: 'Går til servicerutine for friskmelding til arbeidsformidling' });
    };

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
                            Dersom personen skal registreres som arbeidssøker må du følge gjeldende servicerutiner for{' '}
                            <Link
                                href="https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Sykefrav%C3%A6rsomr%C3%A5det-Virkemidler.aspx?web=1"
                                onClick={gaarTilServicerutine}
                            >
                                &quot;Friskmelding til arbeidsformidling&quot;
                            </Link>
                            .
                        </BodyShort>
                    </Alert>
                    <SykmeldtoppfolgingProvider>
                        <SykmeldtFremtidigSituasjon />
                        <TilbakeTilJobb />
                        <SkalTilbakeTilJobb />
                        <Utdanning />
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
