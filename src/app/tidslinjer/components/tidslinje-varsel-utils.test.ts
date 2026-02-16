import type { Hendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { skalHaSoppelbotte, skalHaVarseltrekant } from './tidslinje-varsel-utils';

function lagSendtInnAv(type: string, aarsak?: string) {
	return {
		tidspunkt: '2026-01-15T11:33:26.405Z',
		utfoertAv: { type, id: 'test-id' },
		kilde: 'test-kilde',
		aarsak: aarsak ?? 'test-aarsak',
	};
}

// Periode 1: Skal ha varseltrekant – frist brutt (PAA_VEGNE_AV_STOPP med fristBrutt)
const hendelseMedFristBrutt: Hendelse[] = [
	{
		type: 'PERIODE_STARTET_V1',
		tidspunkt: '2026-01-01T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('SLUTTBRUKER'),
	},
	{
		type: 'PAA_VEGNE_AV_STOPP_V1',
		tidspunkt: '2026-01-10T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('SYSTEM'),
		fristBrutt: true,
	},
	{
		type: 'PERIODE_AVSLUTTET_V1',
		tidspunkt: '2026-01-10T10:00:01.000Z',
		sendtInnAv: lagSendtInnAv('SYSTEM'),
	},
] as Hendelse[];

// Periode 2: Skal ha varseltrekant – avsluttet av SYSTEM
const hendelseMedSystemStopp: Hendelse[] = [
	{
		type: 'PERIODE_STARTET_V1',
		tidspunkt: '2026-01-01T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('SLUTTBRUKER'),
	},
	{
		type: 'PERIODE_AVSLUTTET_V1',
		tidspunkt: '2026-02-02T23:01:17.612Z',
		sendtInnAv: lagSendtInnAv('SYSTEM', '[Bekreftelse] ikke levert innen fristen'),
	},
] as Hendelse[];

// Periode 3: Skal IKKE ha varseltrekant – alt er i orden
const hendelseUtenProblemer: Hendelse[] = [
	{
		type: 'PERIODE_STARTET_V1',
		tidspunkt: '2025-12-16T09:23:13.307Z',
		sendtInnAv: lagSendtInnAv('SLUTTBRUKER'),
	},
	{
		type: 'PERIODE_AVSLUTTET_V1',
		tidspunkt: '2025-12-16T11:33:23.270Z',
		sendtInnAv: lagSendtInnAv('VEILEDER', 'Stopp av periode'),
	},
] as Hendelse[];

// Periode 4: Skal ha varseltrekant – ugyldig bekreftelse
const hendelseMedUgyldigBekreftelse: Hendelse[] = [
	{
		type: 'PERIODE_STARTET_V1',
		tidspunkt: '2026-01-01T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('SLUTTBRUKER'),
	},
	{
		type: 'BEKREFTELSE_V1',
		tidspunkt: '2026-01-15T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('SLUTTBRUKER'),
		status: 'UGYLDIG',
	},
	{
		type: 'PERIODE_AVSLUTTET_V1',
		tidspunkt: '2026-01-20T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('VEILEDER', 'Stopp av periode'),
	},
] as Hendelse[];

// Periode 5: Skal ha varseltrekant – første "på vegne av" er en STOPP (problematisk rekkefølge)
const hendelseMedProblematiskPaVegneAv: Hendelse[] = [
	{
		type: 'PERIODE_STARTET_V1',
		tidspunkt: '2026-01-01T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('SLUTTBRUKER'),
	},
	{
		type: 'PAA_VEGNE_AV_START_V1',
		tidspunkt: '2026-01-10T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('VEILEDER'),
	},
	{
		type: 'PAA_VEGNE_AV_STOPP_V1',
		tidspunkt: '2026-01-05T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('SYSTEM'),
		fristBrutt: false,
	},
	{
		type: 'PERIODE_AVSLUTTET_V1',
		tidspunkt: '2026-01-20T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('VEILEDER', 'Stopp av periode'),
	},
] as Hendelse[];

// Periode 6: Skal ha søppelbøtte – feilregistrering
const hendelseMedFeilregistrering: Hendelse[] = [
	{
		type: 'PERIODE_STARTET_V1',
		tidspunkt: '2025-12-16T11:33:31.515Z',
		sendtInnAv: lagSendtInnAv('VEILEDER'),
	},
	{
		type: 'PERIODE_AVSLUTTET_V1',
		tidspunkt: '2025-12-16T11:33:40.776Z',
		sendtInnAv: lagSendtInnAv('VEILEDER', 'Feilregistrering'),
	},
] as Hendelse[];

const hendelseMedPaVegneAvStoppMenBareEn: Hendelse[] = [
	{
		sendtInnAv: lagSendtInnAv('VEILEDER'),
		tidspunkt: '2026-02-11T09:40:09.652Z',
		type: 'PERIODE_STARTET_V1',
	},
	{
		periodeId: 'a43abadd-5f86-41e0-9b69-31d091861252',
		bekreftelsesloesning: 'DAGPENGER',
		fristBrutt: false,
		tidspunkt: '2026-02-11T09:58:35.287Z',
		type: 'PAA_VEGNE_AV_STOPP_V1',
	},
] as Hendelse[];

const hendelseUtenProblematiskPaVegneAv: Hendelse[] = [
	{
		type: 'PAA_VEGNE_AV_STOPP_V1',
		tidspunkt: '2026-01-02T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('SYSTEM'),
		fristBrutt: false,
	},
	{
		type: 'PAA_VEGNE_AV_START_V1',
		tidspunkt: '2026-01-01T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('VEILEDER'),
	},
	{
		type: 'PERIODE_AVSLUTTET_V1',
		tidspunkt: '2026-01-03T10:00:00.000Z',
		sendtInnAv: lagSendtInnAv('VEILEDER', 'Stopp av periode'),
	},
] as Hendelse[];

// ── Tester ───────────────────────────────────────────────────────────

describe('skalHaVarseltrekant', () => {
	it('skal returnere true dersom perioden har frist brutt', () => {
		expect(skalHaVarseltrekant(hendelseMedFristBrutt)).toBe(true);
	});

	it('skal returnere true dersom perioden er avsluttet av SYSTEM', () => {
		expect(skalHaVarseltrekant(hendelseMedSystemStopp)).toBe(true);
	});

	it('skal returnere true dersom perioden har en ugyldig bekreftelse', () => {
		expect(skalHaVarseltrekant(hendelseMedUgyldigBekreftelse)).toBe(true);
	});

	it('skal returnere true dersom første "på vegne av" er en STOPP (problematisk rekkefølge)', () => {
		expect(skalHaVarseltrekant(hendelseMedProblematiskPaVegneAv)).toBe(true);
	});

	it('skal returnere false når perioden kun har en PAA_VEGNE_AV_STOPP uten fristBrutt (mock periode 1)', () => {
		expect(skalHaVarseltrekant(hendelseMedPaVegneAvStoppMenBareEn)).toBe(false);
	});

	it('skal returnere false dersom perioden ikke inneholder noen uregelmessigheter', () => {
		expect(skalHaVarseltrekant(hendelseUtenProblemer)).toBe(false);
	});

	it('skal returnere false for en tom hendelsesliste', () => {
		expect(skalHaVarseltrekant([])).toBe(false);
	});
	it('skal klare å sortere liste, og se at den er uten problematiske på vegne av', () => {
		expect(skalHaVarseltrekant(hendelseUtenProblematiskPaVegneAv)).toBe(false);
	});
});

describe('skalHaSoppelbotte', () => {
	it('skal returnere true dersom perioden er feilregistrert', () => {
		expect(skalHaSoppelbotte(hendelseMedFeilregistrering)).toBe(true);
	});

	it('skal returnere false for en vanlig periode', () => {
		expect(skalHaSoppelbotte(hendelseUtenProblemer)).toBe(false);
	});
});
