import { getHendelseForklaring } from './hendelse-forklaringer';

describe('getHendelseForklaring', () => {
    it('returnerer kildespesifikk forklaring for PAA_VEGNE_AV_START_V1 + DAGPENGER', () => {
        const result = getHendelseForklaring('PAA_VEGNE_AV_START_V1', 'DAGPENGER');
        expect(result).not.toBeNull();
    });

    it('returnerer kildespesifikk forklaring for PAA_VEGNE_AV_START_V1 + FRISKMELDT_TIL_ARBEIDSFORMIDLING', () => {
        const result = getHendelseForklaring('PAA_VEGNE_AV_START_V1', 'FRISKMELDT_TIL_ARBEIDSFORMIDLING');
        expect(result).not.toBeNull();
    });

    it('returnerer kildespesifikk forklaring for PAA_VEGNE_AV_STOPP_V1 + DAGPENGER (frist ikke brutt)', () => {
        const result = getHendelseForklaring('PAA_VEGNE_AV_STOPP_V1', 'DAGPENGER');
        expect(result).not.toBeNull();
    });

    it('returnerer kildespesifikk forklaring for PAA_VEGNE_AV_STOPP_V1 + FRISKMELDT_TIL_ARBEIDSFORMIDLING (frist ikke brutt)', () => {
        const result = getHendelseForklaring('PAA_VEGNE_AV_STOPP_V1', 'FRISKMELDT_TIL_ARBEIDSFORMIDLING');
        expect(result).not.toBeNull();
    });

    it('returnerer FRIST_BRUTT-forklaring for PAA_VEGNE_AV_STOPP_V1 + DAGPENGER når modifier er FRIST_BRUTT', () => {
        const fristBrutt = getHendelseForklaring('PAA_VEGNE_AV_STOPP_V1', 'DAGPENGER', 'FRIST_BRUTT');
        const normal = getHendelseForklaring('PAA_VEGNE_AV_STOPP_V1', 'DAGPENGER');
        expect(fristBrutt).not.toBeNull();
        expect(fristBrutt).not.toBe(normal);
    });

    it('returnerer FRIST_BRUTT-forklaring for PAA_VEGNE_AV_STOPP_V1 + FRISKMELDT_TIL_ARBEIDSFORMIDLING når modifier er FRIST_BRUTT', () => {
        const fristBrutt = getHendelseForklaring(
            'PAA_VEGNE_AV_STOPP_V1',
            'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
            'FRIST_BRUTT',
        );
        const normal = getHendelseForklaring('PAA_VEGNE_AV_STOPP_V1', 'FRISKMELDT_TIL_ARBEIDSFORMIDLING');
        expect(fristBrutt).not.toBeNull();
        expect(fristBrutt).not.toBe(normal);
    });

    it('faller tilbake til type::source når modifier ikke matcher noen nøkkel', () => {
        const result = getHendelseForklaring('PAA_VEGNE_AV_STOPP_V1', 'DAGPENGER', 'UKJENT_MODIFIER');
        const normal = getHendelseForklaring('PAA_VEGNE_AV_STOPP_V1', 'DAGPENGER');
        expect(result).toBe(normal);
    });

    it('returnerer null for typer uten forklaring', () => {
        expect(getHendelseForklaring('PERIODE_STARTET_V1')).toBeNull();
        expect(getHendelseForklaring('OPPLYSNINGER_V4')).toBeNull();
        expect(getHendelseForklaring('BEKREFTELSE_V1')).toBeNull();
        expect(getHendelseForklaring('PERIODE_AVSLUTTET_V1')).toBeNull();
        expect(getHendelseForklaring('PROFILERING_V1')).toBeNull();
        expect(getHendelseForklaring('EGENVURDERING_V1')).toBeNull();
    });

    it('returnerer null når kilde ikke matcher og det heller ikke finnes generisk fallback', () => {
        expect(getHendelseForklaring('PAA_VEGNE_AV_START_V1', 'UKJENT_KILDE')).toBeNull();
        expect(getHendelseForklaring('PAA_VEGNE_AV_START_V1', '--')).toBeNull();
    });
});
