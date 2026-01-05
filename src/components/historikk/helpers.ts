import { Hendelse, HendelseType } from '@navikt/arbeidssokerregisteret-utils';

export function getSourceString(hendelse: Hendelse): string {
    const MISSING_DATA = '--';
    switch (hendelse.hendelseType) {
        case HendelseType.opplysninger_v4:
            return hendelse.opplysningerV4?.sendtInnAv?.utfoertAv?.type ?? MISSING_DATA;
        case HendelseType.bekreftelse_v1:
            const type = hendelse.bekreftelseV1?.bekreftelse?.svar?.sendtInnAv?.utfoertAv?.type;
            const losning = hendelse.bekreftelseV1?.bekreftelse?.bekreftelsesloesning;
            return type && losning ? `${type} / ${losning}` : MISSING_DATA;
        case HendelseType.pa_vegne_av_stopp_v1:
            return hendelse.paVegneAvStoppV1?.bekreftelsesloesning ?? MISSING_DATA;
        case HendelseType.pa_vegne_av_start_v1:
            return hendelse.paVegneAvStartV1.bekreftelsesloesning ?? MISSING_DATA;
        case HendelseType.periode_avsluttet_v1:
            return hendelse.periodeAvsluttetV1?.utfoertAv?.type ?? MISSING_DATA;
        case HendelseType.periode_startet_v1:
            return hendelse.periodeStartetV1?.utfoertAv?.type ?? MISSING_DATA;
        case HendelseType.profilering_v1:
            return hendelse.profileringV1?.sendtInnAv?.utfoertAv?.type ?? MISSING_DATA;
        case HendelseType.egenvurdering_v1:
            return hendelse.egenvurderingV1?.sendtInnAv.utfoertAv.type ?? MISSING_DATA;
        default:
            return MISSING_DATA;
    }
}
