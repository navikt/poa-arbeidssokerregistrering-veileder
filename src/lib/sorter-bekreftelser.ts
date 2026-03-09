import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';

function sorterBekreftelser(bekreftelser: TilgjengeligBekreftelse[]): TilgjengeligBekreftelse[] {
    return [...bekreftelser].sort((a, b) => new Date(a.gjelderTil).getTime() - new Date(b.gjelderTil).getTime());
}

export { sorterBekreftelser };
