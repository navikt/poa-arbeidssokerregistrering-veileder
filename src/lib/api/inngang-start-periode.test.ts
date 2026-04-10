import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers({ 'x-trace-id': 'test-trace' })),
}));

vi.mock('@/lib/authenticatedFetch', () => ({
    authenticatedFetch: vi.fn(),
}));

import { authenticatedFetch } from '@/lib/authenticatedFetch';
import type { KanStartePeriodeFeil } from '@/model/kan-starte-periode';

const mockAuthenticatedFetch = vi.mocked(authenticatedFetch);

async function importStartPeriode() {
    const mod = await import('@/lib/api/inngang-start-periode');
    return mod.startPeriode;
}

describe('startPeriode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('INNGANG_API_URL', 'http://mock-inngang');
        vi.stubEnv('NAIS_CLUSTER_NAME', 'dev-gcp');
        vi.stubEnv('ENABLE_MOCK', 'disabled');
    });

    // --- Suksess ---

    it('returnerer ok: true ved vellykket start', async () => {
        mockAuthenticatedFetch.mockResolvedValue({
            ok: true,
            data: {},
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result).toEqual({ ok: true });
    });

    // --- Manglende identitetsnummer ---

    it('returnerer feil når identitetsnummer mangler', async () => {
        const startPeriode = await importStartPeriode();
        const result = await startPeriode(null);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe('Mangler identitetsnummer');
        }
        expect(mockAuthenticatedFetch).not.toHaveBeenCalled();
    });

    it('returnerer feil når identitetsnummer er undefined', async () => {
        const startPeriode = await importStartPeriode();
        const result = await startPeriode(undefined);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe('Mangler identitetsnummer');
        }
        expect(mockAuthenticatedFetch).not.toHaveBeenCalled();
    });

    // --- 403 med feilKode AVVIST (domene-avvisning) ---

    it('returnerer avvisningsgrunn når personen er under 18 år', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [{ id: 'UNDER_18_AAR', beskrivelse: 'Er under 18 år' }],
                detaljer: ['ER_UNDER_18_AAR', 'ANSATT_TILGANG', 'HAR_NORSK_ADRESSE'],
            },
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            rawBody: feilV2Body,
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeDefined();
            expect(result.feil?.feilKode).toBe('AVVIST');
            expect(result.feil?.aarsakTilAvvisning?.regler).toEqual([
                { id: 'UNDER_18_AAR', beskrivelse: 'Er under 18 år' },
            ]);
            expect(result.error).toContain('AVVIST');
            expect(result.error).not.toContain('tilgang');
        }
    });

    // --- 403 med feilKode IKKE_TILGANG (ekte tilgangsfeil) ---

    it('returnerer tilgang nektet når veileder ikke har tilgang til personen', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: 'Ansatt har ikke tilgang til bruker',
            feilKode: 'IKKE_TILGANG',
            aarsakTilAvvisning: {
                regler: [{ id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER', beskrivelse: 'Ansatt har ikke tilgang' }],
                detaljer: ['ANSATT_IKKE_TILGANG'],
            },
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            rawBody: feilV2Body,
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeUndefined();
            expect(result.error).toBe('Du har ikke tilgang til denne personen');
        }
    });

    it('returnerer tilgang nektet ved 403 uten gjenkjennelig feilrespons', async () => {
        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            rawBody: undefined,
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeUndefined();
            expect(result.error).toBe('Du har ikke tilgang til denne personen');
        }
    });

    // --- Ikke-403 feil med strukturert feilrespons ---

    it('viser feilkode og melding fra backend ved 424 (ekstern tjenestefeil)', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: 'Uventet feil mot ekstern tjeneste',
            feilKode: 'UVENTET_FEIL_MOT_EKSTERN_TJENESTE',
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('424 Failed Dependency'),
            status: 424,
            rawBody: feilV2Body,
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeDefined();
            expect(result.feil?.feilKode).toBe('UVENTET_FEIL_MOT_EKSTERN_TJENESTE');
            expect(result.feil?.melding).toBe('Uventet feil mot ekstern tjeneste');
            expect(result.error).toBe('UVENTET_FEIL_MOT_EKSTERN_TJENESTE: Uventet feil mot ekstern tjeneste');
        }
    });

    it('viser feilkode og melding fra backend ved 400 (ugyldig forespørsel)', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: 'Ugyldig feilretting',
            feilKode: 'FEIL_VED_LESING_AV_FORESPORSEL',
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('400 Bad Request'),
            status: 400,
            rawBody: feilV2Body,
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeDefined();
            expect(result.feil?.feilKode).toBe('FEIL_VED_LESING_AV_FORESPORSEL');
            expect(result.error).toBe('FEIL_VED_LESING_AV_FORESPORSEL: Ugyldig feilretting');
        }
    });

    it('viser feilkode og melding fra backend ved 500 (ukjent feil)', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: 'Ukjent feil',
            feilKode: 'UKJENT_FEIL',
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('500 Internal Server Error'),
            status: 500,
            rawBody: feilV2Body,
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeDefined();
            expect(result.feil?.feilKode).toBe('UKJENT_FEIL');
            expect(result.error).toBe('UKJENT_FEIL: Ukjent feil');
        }
    });

    it('viser generisk feilmelding når backend-respons har ukjent format', async () => {
        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('500 Internal Server Error'),
            status: 500,
            rawBody: { unexpected: 'format' },
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeUndefined();
            expect(result.error).toBe('500 Internal Server Error');
        }
    });

    it('viser generisk feilmelding når backend ikke returnerer body', async () => {
        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('500 Internal Server Error'),
            status: 500,
            rawBody: undefined,
        });

        const startPeriode = await importStartPeriode();
        const result = await startPeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeUndefined();
            expect(result.error).toBe('500 Internal Server Error');
        }
    });

    // --- Forhåndsgodkjent-flagget ---

    it('sender erForhandsgodkjent i request body', async () => {
        mockAuthenticatedFetch.mockResolvedValue({
            ok: true,
            data: {},
        });

        const startPeriode = await importStartPeriode();
        await startPeriode('12345678901', true);

        expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
            expect.objectContaining({
                body: expect.objectContaining({
                    registreringForhaandsGodkjentAvAnsatt: true,
                }),
            }),
        );
    });
});
