import { Box, Button, ConfirmationPanel } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';
import { loggAktivitet } from '../lib/amplitude';

function SlettPeriodeKnapp() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';
    const [periodeSlettet, setPeriodeSlettet] = useState<boolean>(false);
    const [bekreftet, setBekreftet] = useState<boolean>(false);
    const [error, setError] = useState<any>(undefined);

    const startArbeidssoekerperiodeUrl = brukerMock
        ? '/api/mocks/arbeidssokerperioder-v2'
        : '/api/arbeidssokerperioder-v2';

    async function slettArbeidssoekerperiode() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
            periodeTilstand: 'STOPPET',
            feilretting: {
                feilType: 'Feilregistrering',
            },
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
                loggAktivitet({ aktivitet: 'Sletter arbeidssøkerperiode' });
                setPeriodeSlettet(true);
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
        if (periodeSlettet) {
            router.push('/arbeidssoekerperiode-er-slettet');
        }
    }, [periodeSlettet]);

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
                label="Jeg bekrefter at arbeidssøkerperioden skal slettes på grunn av feilregistrering"
                onChange={() => setBekreftet((x) => !x)}
                className="mb-4"
            />
            <Button variant="danger" disabled={!bekreftet} onClick={() => slettArbeidssoekerperiode()}>
                Slett arbeidssøkerperioden
            </Button>
        </Box>
    );
}

export default SlettPeriodeKnapp;
