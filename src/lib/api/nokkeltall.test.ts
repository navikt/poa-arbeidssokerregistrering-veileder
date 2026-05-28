import type { BekreftelseHendelse, Periode, Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { describe, expect, it, vi } from 'vitest';
import perioderMock from '@/lib/mocks/perioder.json';
import snapshotMock from '@/lib/mocks/snapshot.json';
import { daysSinceDate, toMidnight } from '../date-utils';
import { getNokkeltall } from './nokkeltall';
import { getPerioder } from './oppslag-perioder';
import { getSnapshot } from './oppslag-snapshot';

const MOCK_IDENT = '12345678901';
const MOCK_ENHETS_ID = 4154;

const hentNokkeltall = (ident: string | null = MOCK_IDENT, enhetsId: number = MOCK_ENHETS_ID) =>
    getNokkeltall(ident, enhetsId);

type BekreftelseOverride = Partial<
    Pick<BekreftelseHendelse['svar'], 'harJobbetIDennePerioden' | 'vilFortsetteSomArbeidssoeker'>
>;

/**
 * Genererer et array med BEKREFTELSE_V1-hendelser med 15 dagers intervaller.
 *
 * @param offset - Antall dager fra i dag til den nyeste periodens `gjelderTil`.
 *                 0 = nyeste periode slutter i dag, 30 = nyeste periode sluttet for 30 dager siden.
 * @param amount - Antall bekreftelser å generere, arbeider seg bakover fra offset.
 * @param overrides - Valgfrie per-bekreftelse-overrides (index 0 = nyeste periode).
 *
 */
function lagBekreftelser(
    offset: number = 0,
    amount: number = 1,
    overrides?: BekreftelseOverride[],
): BekreftelseHendelse[] {
    const INTERVAL_DAGER = 15;

    return Array.from({ length: amount }, (_, i) => {
        const gjelderTil = new Date();
        gjelderTil.setDate(gjelderTil.getDate() - offset - i * INTERVAL_DAGER);
        gjelderTil.setHours(22, 0, 0, 0);

        const gjelderFra = new Date(gjelderTil);
        gjelderFra.setDate(gjelderFra.getDate() - INTERVAL_DAGER);
        gjelderFra.setHours(8, 0, 0, 0);

        const tidspunkt = new Date(gjelderTil);
        tidspunkt.setDate(tidspunkt.getDate() + 1);

        return {
            id: crypto.randomUUID(),
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: 'GYLDIG',
            svar: {
                sendtInnAv: {
                    tidspunkt: tidspunkt.toISOString(),
                    utfoertAv: { type: 'SLUTTBRUKER', id: '12345678901' },
                    kilde: 'test',
                    aarsak: 'Bekreftelse levert',
                },
                gjelderFra: gjelderFra.toISOString(),
                gjelderTil: gjelderTil.toISOString(),
                harJobbetIDennePerioden: overrides?.[i]?.harJobbetIDennePerioden ?? false,
                vilFortsetteSomArbeidssoeker: overrides?.[i]?.vilFortsetteSomArbeidssoeker ?? true,
            },
            tidspunkt: tidspunkt.toISOString(),
            type: 'BEKREFTELSE_V1',
        } satisfies BekreftelseHendelse;
    });
}

vi.mock('@/lib/api/oppslag-snapshot', () => ({
    getSnapshot: vi.fn().mockResolvedValue({ snapshot: snapshotMock }),
}));

vi.mock('@/lib/api/oppslag-perioder', () => ({
    getPerioder: vi.fn().mockResolvedValue({ perioder: perioderMock }),
}));

describe('Nøkkeltall', () => {
    describe('Antall dager helt arbeidsledig', () => {
        it('Er helt arbeidsledig (10 dager siden siste bekreftelse)', async (ctx) => {
            const bekreftelser = lagBekreftelser(10, 2);
            const perioderMedBekreftelser = [
                {
                    ...perioderMock[0],
                    hendelser: bekreftelser,
                },
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedBekreftelser as Periode[] });
            const result = await hentNokkeltall();

            const eldsteBekreftelse = bekreftelser.at(-1);
            const startDate = eldsteBekreftelse?.svar.gjelderFra;

            if (!startDate || startDate === undefined) {
                ctx.skip();
                return;
            }
            expect(result).toMatchObject({
                dagerUtenArbeid: daysSinceDate(toMidnight(startDate)),
            });
        });

        it('14 dager siden start', async () => {
            const bekreftelser = lagBekreftelser(14, 3);
            const perioderMedBekreftelser = [
                {
                    ...perioderMock[0],
                    hendelser: bekreftelser,
                },
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedBekreftelser as Periode[] });
            const result = await hentNokkeltall();
            expect(result).toMatchObject({ dagerUtenArbeid: 0 });
        });

        it('13 dager siden start', async (ctx) => {
            const bekreftelser = lagBekreftelser(13, 3);
            const perioderMedBekreftelser = [
                {
                    ...perioderMock[0],
                    hendelser: bekreftelser,
                },
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedBekreftelser as Periode[] });
            const result = await hentNokkeltall();

            const eldsteBekreftelse = bekreftelser.at(-1);
            const startDate = eldsteBekreftelse?.svar.gjelderFra;
            if (!startDate) {
                ctx.skip();
                return;
            }
            const dagerHeltArbeidsledig = daysSinceDate(toMidnight(startDate));
            expect(result).toMatchObject({ dagerUtenArbeid: dagerHeltArbeidsledig });
        });

        it('Lang sammenhengende periode', async () => {
            const bekreftelser = lagBekreftelser(0, Math.ceil((5 * 30) / 15));
            const perioderMedBekreftelser = [
                {
                    ...perioderMock[0],
                    hendelser: bekreftelser,
                },
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedBekreftelser as Periode[] });
            const result = await hentNokkeltall();
            const forventetStreakStart = bekreftelser.at(-1)?.svar.gjelderFra ?? '';
            expect(result).toMatchObject({ dagerUtenArbeid: daysSinceDate(forventetStreakStart) });
        });

        it('2 lange perioder med avbrudd på mer enn 14 dager', async () => {
            const periodeEn = lagBekreftelser(0, 4); // 60 dager
            const periodeTo = lagBekreftelser(80, 4); // 20 dager i mellom
            const alleBekreftelser = [...periodeEn, ...periodeTo];

            const perioderMedBekreftelser = [
                {
                    ...perioderMock[0],
                    hendelser: alleBekreftelser,
                },
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedBekreftelser as Periode[] });
            const result = await hentNokkeltall();
            const forventetStreakStart = periodeEn.at(-1)?.svar.gjelderFra || '';
            expect(result).toMatchObject({ dagerUtenArbeid: daysSinceDate(forventetStreakStart) });
        });
        it('Nøyaktig 14 dager i mellom 2 perioder', async () => {
            // TODO: copy testen over, test mot nøyaktig 14 dagers offset
        });

        it('Mange gyldige bekreftelser, men har svart Ja til "har jobbet" på siste bekreftelse', async () => {
            const bekreftelser = lagBekreftelser(0, 4, [
                { harJobbetIDennePerioden: true },
                { harJobbetIDennePerioden: false },
                { harJobbetIDennePerioden: false },
                { harJobbetIDennePerioden: false },
            ]);

            const perioderMedBekreftelser = [
                {
                    ...perioderMock[0],
                    hendelser: bekreftelser,
                },
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedBekreftelser as Periode[] });
            const result = await hentNokkeltall();
            expect(result).toMatchObject({ dagerUtenArbeid: 0 });
        });

        it('Mange gyldige bekreftelser, men har svart Ja til "har jobbet" inne i rekka', async () => {
            const bekreftelser = lagBekreftelser(0, 4, [
                { harJobbetIDennePerioden: false },
                { harJobbetIDennePerioden: false },
                { harJobbetIDennePerioden: true },
                { harJobbetIDennePerioden: false },
            ]);

            const perioderMedBekreftelser = [
                {
                    ...perioderMock[0],
                    hendelser: bekreftelser,
                },
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedBekreftelser as Periode[] });
            const result = await hentNokkeltall();
            const forventetStreakStart = bekreftelser.at(1)?.svar.gjelderFra || '';
            expect(result).toMatchObject({ dagerUtenArbeid: daysSinceDate(forventetStreakStart) });
        });
    });

    describe('Tilhørighet', () => {
        it('returnerer riktig tilhørighet', async () => {
            const result = await hentNokkeltall();
            expect(result).toMatchObject({ tilhorighet: ['ARBEIDSSOEKERREGISTERET'] });
        });
        it('2 ulike løsninger har anvaret', async () => {
            const perioderMedTrickyTilhorighet = [
                {
                    ...perioderMock[0],
                    hendelser: [
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'DAGPENGER',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-13T08:38:01.468Z',
                            type: 'PAA_VEGNE_AV_START_V1',
                        },
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-13T08:28:01.468Z',
                            type: 'PAA_VEGNE_AV_START_V1',
                        },
                        ...(perioderMock[0]?.hendelser ?? []),
                    ],
                },
                ...perioderMock.slice(1),
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedTrickyTilhorighet as Periode[] });
            const result = await hentNokkeltall();
            expect(result).toMatchObject({ tilhorighet: ['DAGPENGER', 'FRISKMELDT_TIL_ARBEIDSFORMIDLING'] });
        });
        it('2 ulike løsninger har en startet, én av de har avsluttet', async () => {
            const perioderMedTrickyTilhorighet = [
                {
                    ...perioderMock[0],
                    hendelser: [
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'DAGPENGER',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-14T12:00:00.468Z',
                            type: 'PAA_VEGNE_AV_STOPP_V1',
                        },
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'DAGPENGER',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-13T08:38:01.468Z',
                            type: 'PAA_VEGNE_AV_START_V1',
                        },
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-13T08:28:01.468Z',
                            type: 'PAA_VEGNE_AV_START_V1',
                        },
                        ...(perioderMock[0]?.hendelser ?? []),
                    ],
                },
                ...perioderMock.slice(1),
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedTrickyTilhorighet as Periode[] });
            const result = await hentNokkeltall();
            expect(result).toMatchObject({ tilhorighet: ['FRISKMELDT_TIL_ARBEIDSFORMIDLING'] });
        });
        it('ignorer alle på vegene av stopp som er tidligere enn start', async () => {
            const perioderMedTrickyTilhorighet = [
                {
                    ...perioderMock[0],
                    hendelser: [
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'DAGPENGER',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-13T12:00:00.468Z',
                            type: 'PAA_VEGNE_AV_START_V1',
                        },
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'DAGPENGER',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-13T11:00:00.468Z',
                            type: 'PAA_VEGNE_AV_STOPP_V1',
                        },
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'DAGPENGER',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-13T10:00:00.468Z',
                            type: 'PAA_VEGNE_AV_STOPP_V1',
                        },
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'DAGPENGER',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-13T09:10:00.468Z',
                            type: 'PAA_VEGNE_AV_STOPP_V1',
                        },
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-12T08:00:00.468Z',
                            type: 'PAA_VEGNE_AV_STOPP_V1',
                        },
                        {
                            periodeId: 'db8270e6-ea64-469f-93b4-69fb07a472c2',
                            bekreftelsesloesning: 'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: '2026-05-11T07:00:00.468Z',
                            type: 'PAA_VEGNE_AV_START_V1',
                        },
                        ...(perioderMock[0]?.hendelser ?? []),
                    ],
                },
                ...perioderMock.slice(1),
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedTrickyTilhorighet as Periode[] });
            const result = await hentNokkeltall();
            expect(result).toMatchObject({ tilhorighet: ['DAGPENGER'] });
        });
        it('returnerer riktig tilhørighet når personen er hos dagpenger', async () => {
            const perioderMedDagpenger = [
                {
                    ...perioderMock[0],
                    hendelser: [
                        {
                            periodeId: perioderMock[0]?.periodeId,
                            bekreftelsesloesning: 'DAGPENGER',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: new Date().toISOString(),
                            type: 'PAA_VEGNE_AV_START_V1',
                        },
                        ...(perioderMock[0]?.hendelser ?? []),
                    ],
                },
                ...perioderMock.slice(1),
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedDagpenger as Periode[] });
            const result = await hentNokkeltall();
            expect(result).toMatchObject({ tilhorighet: ['DAGPENGER'] });
        });
        it('returnerer riktig tilhørighet når personen er hos sykepenger', async () => {
            const perioderMedDagpenger = [
                {
                    ...perioderMock[0],
                    hendelser: [
                        {
                            periodeId: perioderMock[0]?.periodeId,
                            bekreftelsesloesning: 'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
                            intervalMS: 1209600000,
                            graceMS: 691200000,
                            tidspunkt: new Date().toISOString(),
                            type: 'PAA_VEGNE_AV_START_V1',
                        },
                        ...(perioderMock[0]?.hendelser ?? []),
                    ],
                },
                ...perioderMock.slice(1),
            ];
            vi.mocked(getPerioder).mockResolvedValueOnce({ perioder: perioderMedDagpenger as Periode[] });
            const result = await hentNokkeltall();
            expect(result).toMatchObject({ tilhorighet: ['FRISKMELDT_TIL_ARBEIDSFORMIDLING'] });
        });
    });
    describe('Egenvurdering', () => {
        it('returnerer riktig tekst om egenvurdering når man ønsker hjelp', async () => {
            const result = await hentNokkeltall();
            expect(result).toMatchObject({
                onskerHjelp: { dato: snapshotMock.egenvurdering.tidspunkt, svar: true },
            });
        });
        it('returnerer riktig tekst om egenvurdering når man klarer seg selv', async () => {
            const snapshotMedEgenvurderingGodeMuligheter = {
                ...snapshotMock,
                egenvurdering: {
                    ...snapshotMock.egenvurdering,
                    egenvurdering: 'ANTATT_GODE_MULIGHETER',
                },
            };

            vi.mocked(getSnapshot).mockResolvedValueOnce({
                snapshot: snapshotMedEgenvurderingGodeMuligheter as Snapshot,
            });
            const result = await hentNokkeltall();
            expect(result).toMatchObject({
                onskerHjelp: { dato: snapshotMock.egenvurdering.tidspunkt, svar: false },
            });
        });
    });
    it('returnerer riktig tekst basert på bekreftelse', async () => {
        const result = await hentNokkeltall();
        expect(result).toMatchObject({ bekreftelse: snapshotMock.bekreftelse });
    });
    it('returnerer ingen nøkkeltall dersom du ikke tilhører kontor 4154', async () => {
        const result = await hentNokkeltall('12345678912', 1234);
        expect(result).toBeNull();
    });
});
