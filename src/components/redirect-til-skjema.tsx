import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';

import { RegistreringType } from '../model/registrering';

interface StartregistreringResponse {
    registreringType: RegistreringType;
}

function hentNesteSideUrl(data: StartregistreringResponse) {
    const { registreringType } = data;

    switch (registreringType) {
        case RegistreringType.ORDINAER_REGISTRERING: {
            return `/registrering-arbeidssoker`;
        }
        case RegistreringType.SYKMELDT_REGISTRERING: {
            return `/registrering-mer-sykmeldtoppfolging`;
        }
        case RegistreringType.REAKTIVERING: {
            return '/registrering-reaktivering';
        }
        case RegistreringType.SPERRET: {
            return '/veiledning/sperret';
        }
        case RegistreringType.ALLEREDE_REGISTRERT: {
            return '/veiledning/allerede-registrert';
        }
        default:
            return '/';
    }
}

function RedirectTilSkjema() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const [registreringsData, setRegistreringsData] = useState<StartregistreringResponse>();
    const [error, setError] = useState<any>();
    async function apiKall() {
        try {
            const response = await fetch(`/api/startregistrering?fnr=${fnr}`);
            if (response.ok) {
                const data = await response.json();
                setRegistreringsData(data);
            } else {
                // noinspection ExceptionCaughtLocallyJS
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
        if (registreringsData) {
            router.push(`${hentNesteSideUrl(registreringsData)}`);
        }
    }, [enhetId, fnr, registreringsData, router]);

    useEffect(() => {
        if (error) {
            router.push('/feil/');
        }
    }, [error, router]);

    if (!fnr || !enhetId) {
        return <></>;
    }

    return <Loader size="3xlarge" title="Henter data..." />;
}

export default RedirectTilSkjema;
