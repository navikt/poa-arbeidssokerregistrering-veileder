import type { Bekreftelsesloesning } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

export const LANGTIDSLEDIG_MAX = 180;
export const LANGTIDSLEDIG_MELLOM = 150;
export const ITEMS_PER_PAGE = 15;

export type LocalCustomBekreftelsesloesning = Extract<
    Bekreftelsesloesning,
    'ARBEIDSSOEKERREGISTERET' | 'DAGPENGER' | 'FRISKMELDT_TIL_ARBEIDSFORMIDLING'
>;

export const BEKREFTELSE_LABEL: Record<LocalCustomBekreftelsesloesning, string> = {
    ARBEIDSSOEKERREGISTERET: 'Arbeidssøkerregisteret',
    DAGPENGER: 'Dagpenger',
    FRISKMELDT_TIL_ARBEIDSFORMIDLING: 'Sykepenger',
};

export type DagerFilter = 'alle' | 'kritisk' | 'moderat' | 'lav';
