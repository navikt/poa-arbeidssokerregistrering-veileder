import { BekreftelseStatus } from '@navikt/arbeidssokerregisteret-utils';
import { Hendelse } from '../../model/tidslinjer';

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

export function snakeToCamel(snakeCaseString) {
    return snakeCaseString.replace(/_([a-z])/g, (match, char) => char.toUpperCase());
}
