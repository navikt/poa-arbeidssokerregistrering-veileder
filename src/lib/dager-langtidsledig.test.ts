import { lagPerioder } from '@/lib/mocks/dager-ledig/periode-builder';
import { finnAntallDagerLangtidsledig } from './dager-langtidsledig';

describe('finnAntallDagerLangtidsledig', () => {
    it('returnerer 0 når perioden er avsluttet', () => {
        const perioder = lagPerioder({
            avsluttet: true,
            bekreftelser: [{ gjelderFra: 28, gjelderTil: 14 }],
        });

        expect(finnAntallDagerLangtidsledig(perioder)).toBe(0);
    });

    it('returnerer 0 når det ikke finnes bekreftelser', () => {
        const perioder = lagPerioder({ bekreftelser: [] });

        expect(finnAntallDagerLangtidsledig(perioder)).toBe(0);
    });

    it('returnerer 0 når nyeste bekreftelse har harJobbet=true', () => {
        const perioder = lagPerioder({
            bekreftelser: [
                { gjelderFra: 28, gjelderTil: 14 },
                { gjelderFra: 14, gjelderTil: 0, harJobbet: true },
            ],
        });

        expect(finnAntallDagerLangtidsledig(perioder)).toBe(0);
    });

    it('teller sammenhengende dager fra gyldige bekreftelser', () => {
        const perioder = lagPerioder({
            bekreftelser: [
                { gjelderFra: 28, gjelderTil: 14 },
                { gjelderFra: 14, gjelderTil: 0 },
            ],
        });

        expect(finnAntallDagerLangtidsledig(perioder)).toBe(28);
    });

    it('stopper ved bekreftelse med harJobbet=true i kjeden', () => {
        const perioder = lagPerioder({
            bekreftelser: [
                { gjelderFra: 42, gjelderTil: 28, harJobbet: true },
                { gjelderFra: 28, gjelderTil: 14 },
                { gjelderFra: 14, gjelderTil: 0 },
            ],
        });

        expect(finnAntallDagerLangtidsledig(perioder)).toBe(28);
    });

    it('godkjenner gap >14 dager innen samme periode (systemforsinkelse)', () => {
        const perioder = lagPerioder({
            periodeId: 'same-period',
            bekreftelser: [
                { gjelderFra: 50, gjelderTil: 36 },
                { gjelderFra: 14, gjelderTil: 0 },
            ],
        });

        // Gap mellom gjelderTil=36 og gjelderFra=14 er 22 dager (>14),
        // men samme periodeId → godkjent, teller fra dag 50
        expect(finnAntallDagerLangtidsledig(perioder)).toBe(50);
    });

    it('bryter kjeden ved gap >14 dager mellom ulike perioder', () => {
        const perioder = lagPerioder(
            {
                periodeId: 'periode-1',
                bekreftelser: [{ gjelderFra: 50, gjelderTil: 36 }],
            },
            {
                periodeId: 'periode-2',
                bekreftelser: [{ gjelderFra: 14, gjelderTil: 0 }],
            },
        );

        // Gap mellom perioder er >14 dager og ulik periodeId → bryter
        expect(finnAntallDagerLangtidsledig(perioder)).toBe(14);
    });

    describe('grenseverdier for 14-dagers-regelen', () => {
        it('godkjenner gap på nøyaktig 14 dager (samme periode)', () => {
            const perioder = lagPerioder({
                bekreftelser: [
                    { gjelderFra: 28, gjelderTil: 14 },
                    { gjelderFra: 0, gjelderTil: 0 },
                ],
            });

            // diffInDays(0, 14) = -14, men funksjonen sjekker
            // diffInDays(firstValidatedStartDate, gjelderTil) > 14
            // firstValidatedStartDate starter som today (0), gjelderTil=14 → diff = -14 → ikke > 14
            expect(finnAntallDagerLangtidsledig(perioder)).toBe(28);
        });

        it('bryter ved gap på 15 dager mellom ulike perioder', () => {
            const perioder = lagPerioder(
                {
                    periodeId: 'p1',
                    bekreftelser: [{ gjelderFra: 29, gjelderTil: 15 }],
                },
                {
                    periodeId: 'p2',
                    bekreftelser: [{ gjelderFra: 0, gjelderTil: 0 }],
                },
            );

            // diff(0, 15) = -15 → abs > 14, ulik periodeId → bryter
            expect(finnAntallDagerLangtidsledig(perioder)).toBe(0);
        });
    });
    describe('Mange perioder som ikke inneholder bekreftelser før det til slutt kommer noe', () => {
        it('ignorerer tomme perioder og teller riktig fra perioden med bekreftelser', () => {
            const perioder = lagPerioder(
                {
                    periodeId: 'med-bekreftelser',
                    bekreftelser: [
                        { gjelderFra: 28, gjelderTil: 14 },
                        { gjelderFra: 14, gjelderTil: 0 },
                    ],
                },
                { periodeId: 'tom-1', bekreftelser: [] },
                { periodeId: 'tom-2', bekreftelser: [] },
            );

            expect(finnAntallDagerLangtidsledig(perioder)).toBe(28);
        });

        it('returnerer 0 når avsluttede perioder uten bekreftelser er nyere enn siste bekreftelse', () => {
            // Realistisk scenario (DESC-sortert):
            // Periode 1: aktiv, ingen bekreftelser (ny pågående periode)
            // Periode 2 & 3: avsluttet i dag, ingen bekreftelser
            // Periode 4 & 5: eldre perioder med gyldige bekreftelser
            //
            // nyesteAvsluttet = i dag, nyesteBekreftelse.tidspunkt = 14 dager siden
            // → diffInDays(i dag, 14 dager siden) = 14 > 0 → tidlig exit returnerer 0
            const perioder = lagPerioder(
                { periodeId: 'aktiv-tom', bekreftelser: [] },
                { periodeId: 'avsluttet-tom-1', avsluttet: true, bekreftelser: [] },
                { periodeId: 'avsluttet-tom-2', avsluttet: true, bekreftelser: [] },
                {
                    periodeId: 'gammel-med-bekreftelser-1',
                    bekreftelser: [
                        { gjelderFra: 42, gjelderTil: 28 },
                        { gjelderFra: 28, gjelderTil: 14 },
                    ],
                },
                {
                    periodeId: 'gammel-med-bekreftelser-2',
                    bekreftelser: [
                        { gjelderFra: 70, gjelderTil: 56 },
                        { gjelderFra: 56, gjelderTil: 42 },
                    ],
                },
            );

            expect(finnAntallDagerLangtidsledig(perioder)).toBe(0);
        });
    });
});
