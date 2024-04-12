import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

interface FeilmeldingProps {
    melding?: any;
}

function Feilmelding(props: FeilmeldingProps) {
    const { melding } = props;
    const { aarsakTilAvvisning } = melding || {};

    if (!melding) return null;

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small" className="mb-4">
                Personen kan ikke registrere seg selv som arbeidssøker på nav.no
            </Heading>
            {aarsakTilAvvisning && <BodyLong spacing>Årsak: {aarsakTilAvvisning.beskrivelse}</BodyLong>}
        </Alert>
    );
}

function KanRegistreresSomArbeidssoeker() {
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

    if (kanStarteArbeidssoekerperiode) return null;

    return <Feilmelding melding={error} />;
}

export default KanRegistreresSomArbeidssoeker;
