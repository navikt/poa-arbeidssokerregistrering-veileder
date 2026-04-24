import type { HendelseType } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

/**
 * Forklaringer for hendelsestitlene i historikk-visningen.
 *
 * Nøkkelformat (prioritert rekkefølge):
 *   "${type}::${source}::${modifier}" for modifiserte, kilde-spesifikke forklaringer
 *   "${type}::${source}"              for kilde-spesifikke forklaringer
 *   "${type}"                         for generiske forklaringer (fallback)
 *
 * Kildeverdier matcher råverdiene fra getSourceString() i helpers.ts:
 *   - utfoertAv.type:       SLUTTBRUKER, SYSTEM, VEILEDER
 *   - bekreftelsesloesning: DAGPENGER, FRISKMELDT_TIL_ARBEIDSFORMIDLING
 *
 * Modifiers:
 *   - FRIST_BRUTT: bekreftelsesfristen ble ikke overholdt (fristBrutt === true)
 */
const HENDELSE_FORKLARINGER: Record<string, string> = {
    // --- På vegne av startet ---
    'PAA_VEGNE_AV_START_V1::DAGPENGER':
        'Dagpenger har overtatt ansvaret for å samle inn bekreftelse av arbeidssøkerperioden via meldekortet. Arbeidssøkerregisteret sender ikke ut bekreftelser eller avslutter arbeidssøkerperioden så lenge Dagpenger har dette ansvaret.',

    'PAA_VEGNE_AV_START_V1::FRISKMELDT_TIL_ARBEIDSFORMIDLING':
        'Sykepenger har overtatt ansvaret for å bekrefte arbeidssøkerperioden. Det skjer fordi personen er friskmeldt fra sykmelding og overføres til arbeidsformidling. Arbeidssøkerregisteret sender ikke ut bekreftelser eller avslutter arbeidssøkerperioden så lenge Sykepenger har dette ansvaret.',

    // --- På vegne av stoppet (frist ikke brutt) ---
    'PAA_VEGNE_AV_STOPP_V1::DAGPENGER':
        'Dagpenger har gitt tilbake ansvaret for å bekrefte arbeidssøkerperioden. Arbeidssøkerregisteret tar nå over og sender ut bekreftelser som normalt.',

    'PAA_VEGNE_AV_STOPP_V1::FRISKMELDT_TIL_ARBEIDSFORMIDLING':
        'Sykepenger har gitt tilbake ansvaret for å bekrefte arbeidssøkerperioden. Arbeidssøkerregisteret tar nå over og sender ut bekreftelser som normalt.',

    // --- På vegne av stoppet (frist brutt) ---
    'PAA_VEGNE_AV_STOPP_V1::DAGPENGER::FRIST_BRUTT':
        'Bekreftelsesfristen ble brutt. Personen bekreftet ikke arbeidssøkerstatusen via meldekortet til Dagpenger innen fristen. Dagpenger har gitt tilbake ansvaret til Arbeidssøkerregisteret, og arbeidssøkerperioden har blitt avsluttet som følge av dette.',

    'PAA_VEGNE_AV_STOPP_V1::FRISKMELDT_TIL_ARBEIDSFORMIDLING::FRIST_BRUTT':
        'Bekreftelsesfristen ble brutt. Personen bekreftet ikke arbeidssøkerstatusen via Sykepenger innen fristen. Sykepenger har gitt tilbake ansvaret til Arbeidssøkerregisteret, og arbeidssøkerperioden kan ha blitt avsluttet som følge av dette.',
};

/**
 * Returnerer forklaringstekst for en hendelse, eller null hvis ingen finnes.
 * Prøver mest spesifikke nøkkel først og faller tilbake i prioritert rekkefølge:
 *   1. type::source::modifier
 *   2. type::source
 *   3. type
 */
export function getHendelseForklaring(type: HendelseType, source?: string, modifier?: string): string | null {
    if (source && modifier) {
        const modifiedKey = `${type}::${source}::${modifier}`;
        if (modifiedKey in HENDELSE_FORKLARINGER) {
            return HENDELSE_FORKLARINGER[modifiedKey] ?? null;
        }
    }
    if (source) {
        const specificKey = `${type}::${source}`;
        if (specificKey in HENDELSE_FORKLARINGER) {
            return HENDELSE_FORKLARINGER[specificKey] ?? null;
        }
    }
    return HENDELSE_FORKLARINGER[type] ?? null;
}
