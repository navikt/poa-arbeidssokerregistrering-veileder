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

// Dynamic import so the 'use server' directive and env reads happen after mocks are in place
async function importKanStartePeriode() {
    const mod = await import('@/lib/api/inngang-kan-starte-periode');
    return mod.kanStartePeriode;
}

describe('kanStartePeriode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('INNGANG_API_URL', 'http://mock-inngang');
        vi.stubEnv('NAIS_CLUSTER_NAME', 'dev-gcp');
        vi.stubEnv('ENABLE_MOCK', 'disabled');
    });

    it('returnerer ok: true ved 204 (vellykket sjekk)', async () => {
        mockAuthenticatedFetch.mockResolvedValue({
            ok: true,
            data: {},
        });

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result).toEqual({ ok: true });
    });

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

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeDefined();
            expect(result.feil?.feilKode).toBe('AVVIST');
            expect(result.feil?.aarsakTilAvvisning?.regler).toEqual([
                { id: 'UNDER_18_AAR', beskrivelse: 'Er under 18 år' },
            ]);
            // Skal IKKE vise "Du har ikke tilgang til denne personen"
            expect(result.error).not.toContain('tilgang');
        }
    });

    it('returnerer flere avvisningsregler når flere kriterier ikke er oppfylt', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [
                    { id: 'UNDER_18_AAR', beskrivelse: 'Er under 18 år' },
                    {
                        id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN',
                        beskrivelse: 'Ikke bosatt i Norge',
                    },
                ],
                detaljer: ['ER_UNDER_18_AAR', 'IKKE_BOSATT', 'ANSATT_TILGANG'],
            },
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            rawBody: feilV2Body,
        });

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeDefined();
            expect(result.feil?.feilKode).toBe('AVVIST');
            expect(result.feil?.aarsakTilAvvisning?.regler).toHaveLength(2);
        }
    });

    it('returnerer avvisningsgrunn når personen er registrert som død', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [{ id: 'DOED', beskrivelse: 'Er registrert som død' }],
                detaljer: ['DOED', 'ANSATT_TILGANG'],
            },
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            rawBody: feilV2Body,
        });

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            // Selv harde regler skal returnere feil-objektet — frontend avgjør visning
            expect(result.feil).toBeDefined();
            expect(result.feil?.feilKode).toBe('AVVIST');
            expect(result.feil?.aarsakTilAvvisning?.regler?.[0]?.id).toBe('DOED');
        }
    });

    it('returnerer tilgang nektet når veileder ikke har tilgang til personen', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: 'Ansatt har ikke tilgang til bruker',
            feilKode: 'IKKE_TILGANG',
            aarsakTilAvvisning: {
                regler: [{ id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER', beskrivelse: 'Ansatt har ikke tilgang til bruker' }],
                detaljer: ['ANSATT_IKKE_TILGANG'],
            },
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            rawBody: feilV2Body,
        });

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            // Ekte tilgangsfeil — skal IKKE ha feil-objekt
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

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.feil).toBeUndefined();
            expect(result.error).toBe('Du har ikke tilgang til denne personen');
        }
    });

    it('returnerer tilgang nektet ved 403 med ukjent responsformat', async () => {
        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            rawBody: { message: 'NAV-ansatt har ikke LESE-tilgang til sluttbruker' },
        });

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            // Ikke gjenkjent som KanStartePeriodeFeil → fallback til tilgangNektetError
            expect(result.feil).toBeUndefined();
            expect(result.error).toBe('Du har ikke tilgang til denne personen');
        }
    });

    it('returnerer tilgang nektet når avvisning mangler begrunnelse', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: 'Avvist',
            feilKode: 'AVVIST',
            // Ingen aarsakTilAvvisning
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            rawBody: feilV2Body,
        });

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            // feilKode er AVVIST men aarsakTilAvvisning mangler → behandles som tilgangsfeil (safe default)
            expect(result.feil).toBeUndefined();
            expect(result.error).toBe('Du har ikke tilgang til denne personen');
        }
    });

    it('returnerer feilkode og melding ved serverfeil fra backend', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: 'Uventet feil mot ekstern tjeneste',
            feilKode: 'UVENTET_FEIL_MOT_EKSTERN_TJENESTE',
        };

        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('424 Failed Dependency'),
            status: 424,
            // Inngang-api bruker et annet responsformat enn RFC 9457 ProblemDetails
            rawBody: feilV2Body,
        });

        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode('12345678901');

        expect(result.ok).toBe(false);
        if (!result.ok) {
            // Ikke 403 → går gjennom den vanlige kodeveien (etter 403-sjekken)
            expect(result.feil).toBeDefined();
            expect(result.feil?.feilKode).toBe('UVENTET_FEIL_MOT_EKSTERN_TJENESTE');
        }
    });

    it('returnerer feil når identitetsnummer mangler', async () => {
        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode(null);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe('Identitetsnummer mangler');
        }
        expect(mockAuthenticatedFetch).not.toHaveBeenCalled();
    });

    it('returnerer feil når identitetsnummer er undefined', async () => {
        const kanStartePeriode = await importKanStartePeriode();
        const result = await kanStartePeriode(undefined);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe('Identitetsnummer mangler');
        }
        expect(mockAuthenticatedFetch).not.toHaveBeenCalled();
    });
});
