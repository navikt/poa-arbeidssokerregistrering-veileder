import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Alert, BodyLong, Heading, Loader } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { withAuthenticatedPage } from '../auth/withAuthentication';
import { Config } from '../model/config';

function StarterArbeidssoekerperiodeLoader() {
    return (
        <div className="flex justify-center">
            <Loader size="3xlarge" title="Henter data..." />
        </div>
    );
}

function Feilmelding(props: { feilmelding: any }) {
    if (!props.feilmelding) return null;
    return (
        <Alert variant="warning">
            <Heading size="small" level="1" className="mb-8">
                Personen kan ikke registreres som arbeidssøker
            </Heading>
            <BodyLong>{JSON.stringify(props.feilmelding)}</BodyLong>
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
                throw new Error(response.statusText);
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
