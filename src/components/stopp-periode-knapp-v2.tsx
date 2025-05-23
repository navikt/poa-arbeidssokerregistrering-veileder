import { Button } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';
import { loggAktivitet } from '../lib/amplitude';

function StoppPeriodeKnapp() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';
    const [periodeStoppet, setPeriodeStoppet] = useState<boolean>(false);
    const [error, setError] = useState<any>(undefined);

    const startArbeidssoekerperiodeUrl = brukerMock
        ? '/api/mocks/arbeidssokerperioder-v2'
        : '/api/arbeidssokerperioder-v2';

    async function stoppArbeidssoekerperiode() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
            periodeTilstand: 'STOPPET',
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
                loggAktivitet({ aktivitet: 'Avslutter arbeidssøkerperiode' });
                setPeriodeStoppet(true);
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
        if (periodeStoppet) {
            router.push('/arbeidssoekerperiode-er-avsluttet');
        }
    }, [periodeStoppet]);

    useEffect(() => {
        if (error) {
            router.push('/feil');
        }
    }, [error]);

    if (!fnr) return null;

    return (
        <Button variant="primary" onClick={() => stoppArbeidssoekerperiode()}>
            Avslutt arbeidssøkerperioden
        </Button>
    );
}

export default StoppPeriodeKnapp;
