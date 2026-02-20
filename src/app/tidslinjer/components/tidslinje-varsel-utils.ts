import type { Hendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

function skalHaVarseltrekant(hendelser: Hendelse[]) {
    // Dersom en periode inneholder en ugyldig bekreftelse
    const harUgyldigBekreftelse = hendelser.some(
        (hendelse) => hendelse.type === 'BEKREFTELSE_V1' && hendelse.status !== 'GYLDIG',
    );

    // Dersom en periode er stoppet av "systemet"
    const harAvsluttetAvSystem = hendelser.some(
        (hendelse) => hendelse.type === 'PERIODE_AVSLUTTET_V1' && hendelse.sendtInnAv.utfoertAv.type === 'SYSTEM',
    );

    // Dersom en periode er stoppet som følger av "frist brutt"
    const harFristBrutt = hendelser.some(
        (hendelse) => hendelse.type === 'PAA_VEGNE_AV_STOPP_V1' && hendelse.fristBrutt,
    );

    // Dersom vi har flere "på vegne av", og den første er en "på vegne av STOPP", så er det noe rart
    const allePaaVegneAv = hendelser
        .filter((hendelse) => hendelse.type === 'PAA_VEGNE_AV_START_V1' || hendelse.type === 'PAA_VEGNE_AV_STOPP_V1')
        .sort((a, b) => new Date(a.tidspunkt).getTime() - new Date(b.tidspunkt).getTime());
    const harProblematiskePaVegneAv = allePaaVegneAv.length > 1 && allePaaVegneAv[0]?.type === 'PAA_VEGNE_AV_STOPP_V1';

    // Dersom én av de over stemmer, så skal vi vise et varsel-ikon
    return harAvsluttetAvSystem || harUgyldigBekreftelse || harProblematiskePaVegneAv || harFristBrutt;
}

function skalHaSoppelbotte(hendelser: Hendelse[]) {
    const PERIODE_SLETTET = 'Feilregistrering';
    return hendelser.some((el) => el.type === 'PERIODE_AVSLUTTET_V1' && el.sendtInnAv.aarsak === PERIODE_SLETTET);
}

export { skalHaVarseltrekant, skalHaSoppelbotte };
