import { BekreftelseStatus } from '@navikt/arbeidssokerregisteret-utils';
import { Hendelse } from '../../model/tidslinjer';
import { Hendelse as HendelseV2 } from './models/tidslinjer.types';

export function skalHaVarseltrekant(hendelser: Hendelse[]) {
    const bekreftelser = hendelser.filter((hendelse) => ['bekreftelse_v1'].includes(hendelse.hendelseType));
    const avslutninger = hendelser.filter((hendelse) => ['periode_avsluttet_v1'].includes(hendelse.hendelseType));
    const paVegneAv = hendelser.filter((hendelse) =>
        ['pa_vegne_av_start_v1', 'pa_vegne_av_stopp_v1'].includes(hendelse.hendelseType),
    );
    const paVegneAvStopp = hendelser.filter((hendelse) => ['pa_vegne_av_stopp_v1'].includes(hendelse.hendelseType));

    const fristBrutt = paVegneAvStopp.map((hendelse) => hendelse.paVegneAvStoppV1.fristBrutt).includes(true);

    const problematiskeBekreftelser = bekreftelser.filter(
        (hendelse) => hendelse.bekreftelseV1.status !== BekreftelseStatus.GYLDIG,
    );
    const problematiskeAvslutninger = avslutninger.filter(
        (hendelse) => hendelse.periodeAvsluttetV1.utfoertAv.type === 'SYSTEM',
    );

    const problematiskePaVegneAv = paVegneAv.length > 0 && paVegneAv[0].hendelseType === 'pa_vegne_av_stopp_v1';

    return (
        problematiskeAvslutninger.length > 0 ||
        problematiskeBekreftelser.length > 0 ||
        problematiskePaVegneAv ||
        fristBrutt
    );
}

export function skalHaSoppelbotte(hendelser: Hendelse[]) {
    const avslutninger = hendelser.filter((hendelse) => ['periode_avsluttet_v1'].includes(hendelse.hendelseType));
    const problematiskeAvslutninger = avslutninger.filter(
        (hendelse) => hendelse.periodeAvsluttetV1.aarsak === 'Feilregistrering',
    );
    return problematiskeAvslutninger.length > 0;
}

export function getSourceString(hendelse: HendelseV2): string {
    const MISSING_DATA = '--';
    switch (hendelse.hendelseType) {
        case 'opplysninger_v4':
            return hendelse.opplysningerV4?.sendtInnAv?.utfoertAv?.type ?? MISSING_DATA;
        case 'bekreftelse_v1':
            const type = hendelse.bekreftelseV1?.bekreftelse?.svar?.sendtInnAv?.utfoertAv?.type;
            const losning = hendelse.bekreftelseV1?.bekreftelse?.bekreftelsesloesning;
            return type && losning ? `${type} / ${losning}` : MISSING_DATA;
        case 'pa_vegne_av_stopp_v1':
            return hendelse.paVegneAvStoppV1?.bekreftelsesloesning ?? MISSING_DATA;
        case 'periode_avsluttet_v1':
            return hendelse.periodeAvsluttetV1?.utfoertAv?.type ?? MISSING_DATA;
        case 'periode_startet_v1':
            return hendelse.periodeStartetV1?.utfoertAv?.type ?? MISSING_DATA;
        case 'profilering_v1':
            return hendelse.profileringV1?.sendtInnAv?.utfoertAv?.type ?? MISSING_DATA;
        default:
            return MISSING_DATA;
    }
}
