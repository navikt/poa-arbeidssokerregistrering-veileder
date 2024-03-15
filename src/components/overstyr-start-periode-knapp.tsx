import { Button } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

function OverstyrStartPeriodeKnapp() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';
    const [periodeStartet, setPeriodeStartet] = useState<boolean>(false);
    const [error, setError] = useState<any>(undefined);

    const startArbeidssoekerperiodeUrl = brukerMock ? '/api/mocks/arbeidssokerperioder' : '/api/arbeidssokerperioder';

    async function overstyrStartArbeidssoekerperiode() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
            registreringForhaandsGodkjentAvAnsatt: true,
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
                const data = await response.json();
                setError(data);
            }
        } catch (err: unknown) {
            setError(err);
        }
    }

    useEffect(() => {
        if (periodeStartet) {
            router.push('/registrering-arbeidssoker');
        }
    }, [periodeStartet]);

    useEffect(() => {
        if (error) {
            router.push('/feil');
        }
    }, [error]);

    if (!fnr) return null;

    return (
        <Button variant="primary" onClick={() => overstyrStartArbeidssoekerperiode()}>
            Registrer som arbeidssøker
        </Button>
    );
}

export default OverstyrStartPeriodeKnapp;
