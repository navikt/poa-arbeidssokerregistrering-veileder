import { Hendelse } from "@navikt/arbeidssokerregisteret-utils/oppslag/v3";

export function getSourceString(hendelse: Hendelse): string {
    const MISSING_DATA = '--';
    switch (hendelse.type) {
        case "OPPLYSNINGER_V4":
            return hendelse.sendtInnAv.utfoertAv.type ?? MISSING_DATA;
        case "BEKREFTELSE_V1":
            const type = hendelse.svar.sendtInnAv.utfoertAv.type;
            const losning = hendelse.bekreftelsesloesning;
            return type && losning ? `${type} / ${losning}` : MISSING_DATA;
        case "PAA_VEGNE_AV_STOPP_V1":
            return hendelse.bekreftelsesloesning ?? MISSING_DATA;
        case "PAA_VEGNE_AV_START_V1":
            return hendelse.bekreftelsesloesning ?? MISSING_DATA;
        case "PERIODE_AVSLUTTET_V1":
            return hendelse.sendtInnAv.utfoertAv?.type ?? MISSING_DATA;
        case "PERIODE_STARTET_V1":
            return hendelse.sendtInnAv.utfoertAv?.type ?? MISSING_DATA;
        case "PROFILERING_V1":
            return hendelse.sendtInnAv?.utfoertAv?.type ?? MISSING_DATA;
        case "EGENVURDERING_V1":
            return hendelse.sendtInnAv.utfoertAv.type ?? MISSING_DATA;
        default:
            return MISSING_DATA;
    }
}
