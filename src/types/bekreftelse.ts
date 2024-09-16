export interface Bekreftelse {
    harVaertIArbeid: boolean;
    oenskerAaVaereRegistrert: boolean;
    bekreftelseId: string;
}

export interface TilgjengeligBekreftelse {
    bekreftelseId: string;
    gjelderFra: string;
    gjelderTil: string;
}

export type TilgjengeligeBekreftelser = TilgjengeligBekreftelse[];
