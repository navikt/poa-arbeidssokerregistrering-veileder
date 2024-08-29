import { useEffect, useState } from 'react';
import { Box, Heading, List } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

import KanRegistreresSomArbeidssoekerSjekk from './kan-registreres-som-arbeidssoeker-sjekk-v2';
import VelgRegistreringsKnapp from './velg-registreringsknapp-v2';
import ArbeidssoekerperioderOgOpplysningerWrapper from './arbeidssoekerperioder-og-opplysninger-wrapper';
import VurderingskriterierForArbeidssoekerregistrering from './vurderingskriterier-for-arbeidssoekerregistrering-v2';
import AarsakerTilAtPersonenIkkeKanRegistreres from './aarsaker-til-at-personen-ikke-kan-registreres-v2';
import ArbeidssoekerMaaRegistreresIArena from './arbeidssoeker-maa-registreres-i-arena-foerst-v2';
import { hentSisteArbeidssokerPeriode } from '../lib/hent-siste-arbeidssoekerperiode';
import { REGLER_SOM_KAN_OVERSTYRES } from '../model/regler-for-avvisning';

function sjekkOmAlleReglerKanOverstyres(feilmelding?: any) {
    const { aarsakTilAvvisning } = feilmelding || {};
    const { regler } = aarsakTilAvvisning || {};
    if (!regler) return false;
    const aarsaker = regler.map((regel) => regel.id);
    const reglerSomIkkeKanOverstyres = aarsaker.filter((regel) => !REGLER_SOM_KAN_OVERSTYRES.includes(regel));
    return reglerSomIkkeKanOverstyres.length === 0;
}

function GenereltOmSamtykke() {
    return (
        <Box>
            <List as="ul" size="small" title="Før du registrerer arbeidssøker må du sørge for at:">
                <List.Item>Personen som skal registreres er informert og har samtykket til registreringen</List.Item>
                <List.Item>
                    Det er gitt informasjon om at den registrerte må sende meldekort hver 14. dag for å opprettholde
                    arbeidssøkerstatusen
                </List.Item>
            </List>
        </Box>
    );
}

function ArbeidssoekerstatusOversiktV2() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr, enhetId } = params;
    const brukerMock = enableMock === 'enabled';
    const [kanStarteArbeidssoekerperiode, setKanStarteArbeidssoekerperiode] = useState<boolean>(false);
    const [error, setError] = useState<any>(undefined);
    const [kanIkkeStarteArbeidssoekerperiode, setKanIkkeStarteArbeidssoekerperiode] = useState<boolean>(false);
    const [errorArbeidssoekerperioder, setErrorArbeidssoekerperioder] = useState<any>(undefined);
    const [sisteArbeidssoekerperiode, setSisteArbeidssoekerperiode] = useState<any>({});
    const [harIkkeAktivPeriode, setHarIkkeAktivPeriode] = useState<boolean>(false);

    const sjekkKanStarteArbeidssoekerperiodeUrl = brukerMock
        ? '/api/mocks/kan-starte-arbeidssoekerperiode-v2'
        : '/api/kan-starte-arbeidssoekerperiode-v2';

    const hentArbeidssoekerperioderUrl = brukerMock
        ? '/api/mocks/oppslag-arbeidssoekerperioder'
        : '/api/oppslag-arbeidssoekerperioder';

    const kanOverstyres = sjekkOmAlleReglerKanOverstyres(error);

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

    async function apiKallArbeidssoekerperioder() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
        });

        try {
            const response = await fetch(hentArbeidssoekerperioderUrl, {
                method: 'POST',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                const sisteArbeidssoekerperiode = hentSisteArbeidssokerPeriode(data);
                setSisteArbeidssoekerperiode(sisteArbeidssoekerperiode);
            }
        } catch (err: unknown) {
            setErrorArbeidssoekerperioder(err);
        }
    }

    useEffect(() => {
        if (fnr && enhetId) {
            setKanStarteArbeidssoekerperiode(false);
            setError(undefined);
            setSisteArbeidssoekerperiode({});
            setErrorArbeidssoekerperioder(undefined);
            apiKall();
            apiKallArbeidssoekerperioder();
        }
    }, [fnr, enhetId]);

    useEffect(() => {
        if (sisteArbeidssoekerperiode) {
            const aktivPeriode =
                sisteArbeidssoekerperiode?.avsluttet === null && sisteArbeidssoekerperiode !== undefined;
            setHarIkkeAktivPeriode(!aktivPeriode);
        }
    }, [sisteArbeidssoekerperiode]);

    if (!fnr || !enhetId) return null;

    return (
        <Box>
            <Heading level="1" size="large" className="mb-8 text-left">
                Arbeidssøkerregistrering
            </Heading>
            {harIkkeAktivPeriode && (
                <KanRegistreresSomArbeidssoekerSjekk
                    feilmelding={error}
                    kanStarteArbeidssoekerperiode={kanStarteArbeidssoekerperiode}
                />
            )}
            {harIkkeAktivPeriode && (
                <>
                    <AarsakerTilAtPersonenIkkeKanRegistreres feilmelding={error} />
                    <VurderingskriterierForArbeidssoekerregistrering feilmelding={error} />
                    <ArbeidssoekerMaaRegistreresIArena feilmelding={error} />
                </>
            )}
            {(kanOverstyres || kanStarteArbeidssoekerperiode) && harIkkeAktivPeriode && <GenereltOmSamtykke />}
            {harIkkeAktivPeriode && (
                <VelgRegistreringsKnapp
                    feilmelding={error}
                    kanStarteArbeidssoekerperiode={kanStarteArbeidssoekerperiode}
                />
            )}
            <div className="mt-8">
                <ArbeidssoekerperioderOgOpplysningerWrapper />
            </div>
        </Box>
    );
}

export default ArbeidssoekerstatusOversiktV2;
