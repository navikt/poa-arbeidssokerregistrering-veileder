import { useEffect, useState } from 'react';
import { Box, Heading, List } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

import KanRegistreresSomArbeidssoekerSjekk from './kan-registreres-som-arbeidssoeker-sjekk';
import VelgRegistreringsKnapp from './velg-registreringsknapp';
import ArbeidssoekerperioderOgOpplysninger from './arbeidssoekerperioder-og-opplysninger';

const KAN_IKKE_OVERSTYRES_REGLER = ['IKKE_FUNNET', 'DOED', 'SAVNET', 'ANSATT_IKKE_TILGANG_TIL_BRUKER'];

function sjekkOmRegelKanOverstyres(feilmelding?: any) {
    const { aarsakTilAvvisning } = feilmelding || {};
    const { regel } = aarsakTilAvvisning || {};
    if (!regel) return true;
    return regel && !KAN_IKKE_OVERSTYRES_REGLER.includes(regel);
}

function GenereltOmSamtykke() {
    return (
        <Box>
            <List as="ul" title="Før du registrerer arbeidssøker må du sørge for at">
                <List.Item>Personen som skal registreres er informert og har samtykket til registreringen</List.Item>
                <List.Item>
                    Det er gitt informasjon om at den registrerte må sende meldekort hver 14. dag for å opprettholde
                    arbeidssøkerstatusen
                </List.Item>
            </List>
        </Box>
    );
}

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

    const kanOverstyres = sjekkOmRegelKanOverstyres(error);

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
            <ArbeidssoekerperioderOgOpplysninger />
            {kanOverstyres && <GenereltOmSamtykke />}
            <VelgRegistreringsKnapp feilmelding={error} kanStarteArbeidssoekerperiode={kanStarteArbeidssoekerperiode} />
        </Box>
    );
}

export default ArbeidssoekerstatusOversikt;
