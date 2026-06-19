import type { Periode, Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { describe, expect, it, vi } from 'vitest';
import perioderMock from '@/lib/mocks/perioder.json';
import snapshotMock from '@/lib/mocks/snapshot.json';
import { getNokkeltall } from './nokkeltall';
import { getPerioder } from './oppslag-perioder';
import { getSnapshot } from './oppslag-snapshot';

const MOCK_IDENT = '12345678901';
const MOCK_ENHETS_ID = '4154';

const hentNokkeltall = (ident: string | null = MOCK_IDENT, enhetsId: string | null = MOCK_ENHETS_ID) =>
    getNokkeltall(ident, enhetsId);

vi.mock('@/lib/api/oppslag-snapshot', () => ({
    getSnapshot: vi.fn().mockResolvedValue({ snapshot: snapshotMock }),
}));

vi.mock('@/lib/api/oppslag-perioder', () => ({
    getPerioder: vi.fn().mockResolvedValue({ perioder: perioderMock }),
}));

describe('Nøkkeltall', () => {
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
        const result = await hentNokkeltall('12345678912', '1234');
        expect(result).toBeNull();
    });
});
