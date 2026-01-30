import { HendelseType } from "@navikt/arbeidssokerregisteret-utils/oppslag/v3";

const ALLE_HENDELSER = [
    "BEKREFTELSE_V1",
    "EGENVURDERING_V1",
    "PROFILERING_V1",
    "OPPLYSNINGER_V4",
    "PERIODE_STARTET_V1",
    "PERIODE_AVSLUTTET_V1",
    "PAA_VEGNE_AV_STOPP_V1",
    "PAA_VEGNE_AV_START_V1"
] as const satisfies HendelseType[];

export { ALLE_HENDELSER };