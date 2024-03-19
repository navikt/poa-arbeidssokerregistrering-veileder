import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Alert, BodyLong, Heading, Link, Loader } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { withAuthenticatedPage } from '../auth/withAuthentication';
import { Config } from '../model/config';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import OverstyrStartPeriodeKnapp from '../components/overstyr-start-periode-knapp';
import { loggAktivitet } from '../lib/amplitude';

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
            <BodyLong>
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
                <OverstyrStartPeriodeKnapp />
            </div>
        </>
    );
}

function Feilmelding(props: { feilmelding: any }) {
    const { aarsakTilAvvisning } = props.feilmelding || {};
    const erUnder18 = aarsakTilAvvisning && aarsakTilAvvisning.regel === 'UNDER_18_AAR';
    const generiskFeil = !erUnder18;
    if (!props.feilmelding) return null;
    return (
        <Alert variant="warning">
            <Heading size="small" level="1" className="mb-8">
                Personen kan ikke registreres som arbeidssøker
            </Heading>
            {erUnder18 && <ErUnder18 />}
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
