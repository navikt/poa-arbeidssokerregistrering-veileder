import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

/**
 * Hjelpefunksjoner for å bygge testdata til finnAntallDagerLangtidsledig.
 * Inneholder kun feltene funksjonen faktisk leser — gjør testene lettere å lese.
 */

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
}

type BekreftelseOpts = {
    gjelderFra: number; // dager siden i dag
    gjelderTil: number; // dager siden i dag
    tidspunkt?: number; // dager siden i dag (default: gjelderTil)
    harJobbet?: boolean;
};

function lagBekreftelse({ gjelderFra, gjelderTil, tidspunkt, harJobbet = false }: BekreftelseOpts) {
    return {
        type: 'BEKREFTELSE_V1' as const,
        tidspunkt: daysAgo(tidspunkt ?? gjelderTil),
        svar: {
            gjelderFra: daysAgo(gjelderFra),
            gjelderTil: daysAgo(gjelderTil),
            harJobbetIDennePerioden: harJobbet,
        },
    };
}

type PeriodeOpts = {
    periodeId?: string;
    avsluttet?: boolean;
    bekreftelser: BekreftelseOpts[];
};

function lagPeriode({ periodeId = '1', avsluttet = false, bekreftelser }: PeriodeOpts) {
    return {
        periodeId,
        ...(avsluttet ? { avsluttet: daysAgo(0) } : {}),
        hendelser: bekreftelser.map((b) => lagBekreftelse(b)),
    };
}

function lagPerioder(...perioder: PeriodeOpts[]): Periode[] {
    return perioder.map((p) => lagPeriode(p)) as unknown as Periode[];
}

export { daysAgo, lagBekreftelse, lagPeriode, lagPerioder };
