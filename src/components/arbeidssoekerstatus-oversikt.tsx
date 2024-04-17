import { useEffect, useState } from 'react';
import { Box, Heading, List } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

import KanRegistreresSomArbeidssoekerSjekk from './kan-registreres-som-arbeidssoeker-sjekk';
import VelgRegistreringsKnapp from './velg-registreringsknapp';

function ArbeidssoekerstatusOversikt() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr, enhetId } = params;
    const brukerMock = enableMock === 'enabled';
    const [kanStarteArbeidssoekerperiode, setKanStarteArbeidssoekerperiode] = useState<boolean>(false);
    const [error, setError] = useState<any>(undefined);
    const [kanIkkeStarteArbeidssoekerperiode, setKanIkkeStarteArbeidssoekerperiode] = useState<boolean>(false);

    const sjekkKanStarteArbeidssoekerperiodeUrl = brukerMock
        ? '/api/mocks/kan-starte-arbeidssoekerperiode'
        : '/api/kan-starte-arbeidssoekerperiode';

    async function apiKall() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
        });

        try {
            const response = await fetch(sjekkKanStarteArbeidssoekerperiodeUrl, {
                method: 'PUT',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                setKanStarteArbeidssoekerperiode(true);
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

    if (!fnr || !enhetId) return null;

    return (
        <Box className="flex flex-col items-center p-8">
            <KanRegistreresSomArbeidssoekerSjekk
                feilmelding={error}
                kanStarteArbeidssoekerperiode={kanStarteArbeidssoekerperiode}
            />
            <Heading level="1" size="large" className="mb-8 text-center">
                Arbeidssøkerregistrering
            </Heading>
            <div className="flex flex-row justify-between">
                <div>
                    <List as="ul" title="Velg arbeidssøkerregistrering hvis">
                        <List.Item>Personen skal være arbeidssøker fra i dag</List.Item>
                        <List.Item>Personen skal ha oppfølgingsvedtak 14a</List.Item>
                        <List.Item>Personen skal stå tilmeldt i arbeidssøkerregisteret</List.Item>
                    </List>
                    <VelgRegistreringsKnapp
                        feilmelding={error}
                        kanStarteArbeidssoekerperiode={kanStarteArbeidssoekerperiode}
                    />
                </div>
            </div>
        </Box>
    );
}

export default ArbeidssoekerstatusOversikt;
