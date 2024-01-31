import { lagHentTekstForSprak, SPORSMAL_TEKSTER, Sprak } from '@navikt/arbeidssokerregisteret-utils';

export function hentTekst(sprak: Sprak, key: string) {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, sprak);
    return tekst(key);
}
