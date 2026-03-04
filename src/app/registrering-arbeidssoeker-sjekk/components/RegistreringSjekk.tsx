'use client';

import { BodyShort } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';
import type { KanStartePeriodeFeil, KanStartePeriodeResult } from '@/app/lib/models/kan-starte-periode';
import AarsakerTilAtPersonenIkkeKanRegistreres from './avvist/AarsakerTilAtPersonenIkkeKanRegistreres';
import ArbeidssoekerMaaRegistreresIArena from './avvist/ArbeidssoekerMaaRegistreresIArena';
import KanRegistreresSomArbeidssoekerSjekk from './avvist/KanRegistreresSomArbeidssoekerSjekk';
import { klassifiserAvvisning } from './avvist/klassifiserAvvisning';
import VelgRegistreringsKnapp from './avvist/VelgRegistreringsKnapp';
import VurderingskriterierForArbeidssoekerregistrering from './avvist/VurderingskriterierForArbeidssoekerregistrering';

type RegistreringSjekkProps = {
    kanStartePromise: Promise<KanStartePeriodeResult>;
};

/**
 * Resolver resultatet fra `PUT /api/v2/arbeidssoker/kanStartePeriode` og
 * bestemmer hva som skal vises.
 *
 * - **204 (ok)** → redirect til registreringsskjemaet.
 * - **Avvisning med `feil`** → klassifiserer avvisningen én gang via
 *   {@link klassifiserAvvisning} og bruker resultatet til å styre hvilke
 *   sub-komponenter som rendres. Hver sub-komponent er ren presentasjon.
 * - **Feil uten strukturert `feil`-objekt** → viser en enkel feilmelding (fallback).
 *
 * Må rendres innenfor en `<Suspense>`-boundary fordi den bruker `use()`.
 */
function RegistreringSjekk({ kanStartePromise }: RegistreringSjekkProps) {
    const result = use(kanStartePromise);
    const router = useRouter();

    useEffect(() => {
        if (result.ok) {
            router.replace('/registrering-arbeidssoker');
        }
    }, [result, router]);

    if (result.ok) {
        return null;
    }

    const avvist = result as { ok: false; error: string; feil?: KanStartePeriodeFeil };
    const { feil } = avvist;

    if (!feil) {
        return <BodyShort spacing>{avvist.error}</BodyShort>;
    }

    const klassifisering = klassifiserAvvisning(feil);

    return (
        <>
            {/* Hovedvarsel — viser årsaken til avvisningen og reglene som slo ut. Har spesialhåndtering for UNDER_18_AAR. */}
            <KanRegistreresSomArbeidssoekerSjekk feilmelding={feil} klassifisering={klassifisering} />

            {/* Tiltak for harde regler (DOED, SAVNET, IKKE_FUNNET, ANSATT_IKKE_TILGANG_TIL_BRUKER) — vises kun når reglene IKKE kan overstyres. */}
            {!klassifisering.kanAlleReglerOverstyres && (
                <AarsakerTilAtPersonenIkkeKanRegistreres
                    feilmelding={feil}
                    ansattManglerTilgang={klassifisering.ansattManglerTilgang}
                />
            )}

            {/* Begrunnelse og tiltak for myke regler (UNDER_18_AAR, UKJENT_ALDER, adresse) — vises kun når reglene KAN overstyres og ansatt har tilgang. */}
            {klassifisering.kanAlleReglerOverstyres && !klassifisering.ansattManglerTilgang && (
                <VurderingskriterierForArbeidssoekerregistrering regler={klassifisering.regler} />
            )}

            {/* Instruksjoner for Arena-registrering — vises kun ved ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT. */}
            {klassifisering.maaRegistreresIArenaFoerst && <ArbeidssoekerMaaRegistreresIArena />}

            {/* Registreringsknapp med overstyring — vises kun når alle regler kan overstyres og ansatt har tilgang. */}
            {klassifisering.kanAlleReglerOverstyres && !klassifisering.ansattManglerTilgang && (
                <VelgRegistreringsKnapp />
            )}
        </>
    );
}

export { RegistreringSjekk };
