import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Alert, BodyLong, Heading, Link, Loader } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { withAuthenticatedPage } from '../auth/withAuthentication';
import { Config } from '../model/config';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import StartPeriodeKnappMedOverstyring from '../components/start-periode-knapp-med-overstyring';
import { loggAktivitet } from '../lib/tracking';

function StarterArbeidssoekerperiodeLoader() {
    return (
        <div className="flex justify-center">
            <Loader size="3xlarge" title="Henter data..." />
        </div>
    );
}

const gaarTilServicerutine = () => {
    loggAktivitet({ aktivitet: 'Går til servicerutine for samtykke for personer under 18' });
};

function ErUnder18() {
    return (
        <>
            <BodyLong spacing>Personen er under 18 år og vil derfor trenge samtykke fra foresatte.</BodyLong>
            <BodyLong spacing>
                Det du må gjøre videre er beskrevet i{' '}
                <Link
                    href="https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Servicerutine-for-innhenting-av-samtykke-fra-foresatte-for-unge-under-18-%C3%A5r-ved-registrering-som-arbeidss%C3%B8ker,.aspx"
                    onClick={gaarTilServicerutine}
                >
                    Samtykke fra foresatte til unge under 18 år - registrering som arbeidssøker, øvrige tiltak og
                    tjenester.
                </Link>
            </BodyLong>
            <BodyLong spacing>Dersom samtykke er innhentet kan du går videre med registreringen.</BodyLong>
            <div className="mt-8">
                <StartPeriodeKnappMedOverstyring />
            </div>
        </>
    );
}

function IkkeBosatt() {
    return (
        <>
            <BodyLong spacing>Vedkommende er ifølge våre systemer ikke bosatt etter folkeregisterloven.</BodyLong>
            <BodyLong>
                Du kan be personen oppsøke{' '}
                <Link href="https://www.workinnorway.no/no/Forside">sidene til Work in Norway</Link> for å få vite mer
                om hva som kreves for å være arbeidssøker i Norge.
            </BodyLong>
            <BodyLong spacing>
                Personen kan selv kontakte folkeregisteret for å gjøre endringer{' '}
                <Link href="https://www.skatteetaten.no/person/folkeregister/endre/">på nettsiden deres</Link>.
            </BodyLong>
            <BodyLong spacing>
                Hvis du ønsker å hjelpe personen men å registrere endringer hos folkeregisteret kan du gjøre det fra{' '}
                <Link href="https://www.skatteetaten.no/person/folkeregister/tips-om-avvik-i-folkeregisteret/for-offentlige/">
                    tipssiden deres for avvik
                </Link>
                .
            </BodyLong>
        </>
    );
}

function ManglendeRegisterOpplysninger() {
    return (
        <>
            <BodyLong spacing>
                Opplysningene vi henter fra folkeregisteret oppfyller ikke kravene til at denne personen kan registrere
                seg som arbeidssøker.
            </BodyLong>
            <BodyLong spacing>
                Personen kan selv kontakte folkeregisteret for å gjøre endringer{' '}
                <Link href="https://www.skatteetaten.no/person/folkeregister/endre/">på nettsiden deres</Link>.
            </BodyLong>
            <BodyLong spacing>
                Hvis du ønsker å hjelpe personen men å registrere endringer hos folkeregisteret kan du gjøre det fra{' '}
                <Link href="https://www.skatteetaten.no/person/folkeregister/tips-om-avvik-i-folkeregisteret/for-offentlige/">
                    tipssiden deres for avvik
                </Link>
                .
            </BodyLong>
        </>
    );
}

function IkkeTilgangTilPerson() {
    return (
        <>
            <BodyLong spacing>Du har ikke de nødvendige tilgangene for å kunne registrere denne personen.</BodyLong>
            <BodyLong spacing>
                Dersom du mener dette er feil må du kontakte din lokale identansvarlig. Dette er vanligvis enhetens
                leder.
            </BodyLong>
        </>
    );
}

function Feilmelding(props: { feilmelding: any }) {
    const { aarsakTilAvvisning } = props.feilmelding || {};
    const erUnder18 = aarsakTilAvvisning && aarsakTilAvvisning.regel === 'UNDER_18_AAR';
    const ikkeBosatt =
        aarsakTilAvvisning && aarsakTilAvvisning.regel === 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN';
    const ikkeTilgang = aarsakTilAvvisning && aarsakTilAvvisning.regel === 'ANSATT_IKKE_TILGANG_TIL_BRUKER';
    const manglendeOpplysninger =
        aarsakTilAvvisning && ['IKKE_FUNNET', 'SAVNET', 'DOED'].includes(aarsakTilAvvisning.regel);
    const generiskFeil = !erUnder18 && !ikkeBosatt && !ikkeTilgang && !manglendeOpplysninger;
    if (!props.feilmelding) return null;
    return (
        <Alert variant="warning">
            <Heading size="small" level="1" className="mb-8">
                Personen kan ikke registreres som arbeidssøker
            </Heading>
            {erUnder18 && <ErUnder18 />}
            {ikkeBosatt && <IkkeBosatt />}
            {ikkeTilgang && <IkkeTilgangTilPerson />}
            {manglendeOpplysninger && <ManglendeRegisterOpplysninger />}
            {generiskFeil && <BodyLong>{JSON.stringify(props.feilmelding)}</BodyLong>}
        </Alert>
    );
}

export default function KanRegistreresSomArbeidssoeker() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr, enhetId } = params;
    const brukerMock = enableMock === 'enabled';
    const [periodeStartet, setPeriodeStartet] = useState<boolean>(false);
    const [error, setError] = useState<any>(undefined);
    const [kanIkkeStarteArbeidssoekerperiode, setKanIkkeStarteArbeidssoekerperiode] = useState<boolean>(false);

    const startArbeidssoekerperiodeUrl = brukerMock ? '/api/mocks/arbeidssokerperioder' : '/api/arbeidssokerperioder';

    async function apiKall() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
            periodeTilstand: 'STARTET',
        });

        try {
            const response = await fetch(startArbeidssoekerperiodeUrl, {
                method: 'PUT',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                setPeriodeStartet(true);
            } else {
                // noinspection ExceptionCaughtLocallyJS
                setKanIkkeStarteArbeidssoekerperiode(true);
                const data = await response.json();
                setError(data);
            }
        } catch (err: unknown) {
            setError(err);
        }
    }

    useEffect(() => {
        if (fnr && enhetId) {
            apiKall();
        }
    }, [fnr, enhetId]);

    useEffect(() => {
        if (periodeStartet) {
            router.push('/registrering-arbeidssoker');
        }
    }, [periodeStartet]);

    if (!fnr) {
        return <ManglerPersonEllerEnhet />;
    }

    return (
        <>
            {kanIkkeStarteArbeidssoekerperiode ? (
                <Feilmelding feilmelding={error} />
            ) : (
                <StarterArbeidssoekerperiodeLoader />
            )}
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
