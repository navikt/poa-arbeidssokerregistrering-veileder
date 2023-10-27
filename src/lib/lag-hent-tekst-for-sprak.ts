const SPRAK = ['nb', 'en', 'nn', 'pl'] as const;

export type Sprak = (typeof SPRAK)[number];

export function erStottetSprak(s?: string): s is Sprak {
    return SPRAK.includes(s as Sprak);
}

export type TeksterMedDefinerteNokler<K extends string, T> = { nb: Record<K, T> } & Partial<{
    [P in Exclude<Sprak, 'nb'>]: Record<K, T>;
}>;
export type Tekster<T> = TeksterMedDefinerteNokler<string, T>;
const lagHentTekstForSprak = (tekster: Tekster<any>, sprak: Sprak) => (key: string) => {
    const tekst = tekster[sprak];

    if (tekst) {
        return tekst[key] || tekster.nb[key];
    }

    return tekster.nb[key];
};

export default lagHentTekstForSprak;
