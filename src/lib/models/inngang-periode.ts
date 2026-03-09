/**
 * Types for the `periode` API (PUT /api/v2/arbeidssoker/periode).
 *
 * Based on the OpenAPI spec:
 * https://github.com/navikt/paw-arbeidssoekerregisteret-monorepo-intern/blob/main/apps/api-start-stopp-perioder/src/main/resources/openapi/startstopp.yaml
 */

import type { KanStartePeriodeFeil } from '@/lib/models/kan-starte-periode';

// --- Enums ---

export type PeriodeTilstand = 'STARTET' | 'STOPPET';

type FeilrettingType = 'FeilTidspunkt' | 'Feilregistrering';

// --- Composite types ---

export type Feilretting = {
    feilType: FeilrettingType;
    /** Valgfri kommentar til feilretting */
    melding?: string;
    /** Tidspunkt som må brukes ved feilType=FeilTidspunkt (ISO 8601 date-time) */
    tidspunkt?: string;
};

/** Request body for PUT /api/v2/arbeidssoker/periode */
export type StartStoppPeriodeRequest = {
    /** Fødselsnummer eller D-nummer (11 siffer) */
    identitetsnummer: string;
    periodeTilstand: PeriodeTilstand;
    registreringForhaandsGodkjentAvAnsatt?: boolean;
    /** Feilretting kan kun benyttes når innlogget bruker er ansatt */
    feilretting?: Feilretting;
};

/**
 * Error response from the `periode` API (FeilV2 in the OpenAPI spec).
 * Re-exported from kan-starte-periode since the schema is identical.
 */
export type PeriodeFeil = KanStartePeriodeFeil;

// --- Result type for the server action ---

export type PeriodeResult = { ok: true } | { ok: false; error: string; feil?: PeriodeFeil };
