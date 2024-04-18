import { Button, Box, ConfirmationPanel } from '@navikt/ds-react';
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
    const [bekreftet, setBekreftet] = useState(false);

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
        <Box>
            <ConfirmationPanel
                checked={bekreftet}
                label="Jeg bekrefter at de nødvendige vurderingene er gjort og dokumentert"
                onChange={() => setBekreftet((x) => !x)}
                className="mb-4"
            />
            <Button
                variant="secondary-neutral"
                disabled={!bekreftet}
                onClick={() => overstyrStartArbeidssoekerperiode()}
            >
                Registrer som arbeidssøker
            </Button>
        </Box>
    );
}

export default OverstyrStartPeriodeKnapp;
