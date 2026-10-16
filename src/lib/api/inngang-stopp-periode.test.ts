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

async function importStoppPeriode() {
    const mod = await import('@/lib/api/inngang-stopp-periode');
    return mod.stoppPeriode;
}

describe('stoppPeriode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('INNGANG_API_URL', 'http://mock-inngang');
        vi.stubEnv('NAIS_CLUSTER_NAME', 'dev-gcp');
        vi.stubEnv('ENABLE_MOCK', 'disabled');
    });

    it('sender PUT til inngang-API-et med forventet scope og body', async () => {
        mockAuthenticatedFetch.mockResolvedValue({ ok: true, data: {} });

        const stoppPeriode = await importStoppPeriode();
        const result = await stoppPeriode('12345678901');

        expect(result).toEqual({ ok: true });
        expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'http://mock-inngang/api/v2/arbeidssoker/periode',
                scope: 'api://dev-gcp.paw.paw-arbeidssokerregisteret-api-inngang/.default',
                method: 'PUT',
                body: {
                    identitetsnummer: '12345678901',
                    periodeTilstand: 'STOPPET',
                },
            }),
        );
        expect(mockAuthenticatedFetch.mock.calls[0]?.[0].headers).toEqual(new Headers({ 'x-trace-id': 'test-trace' }));
    });

    it.each([null, undefined])('returnerer feil når identitetsnummer er %s', async (identitetsnummer) => {
        const stoppPeriode = await importStoppPeriode();
        const result = await stoppPeriode(identitetsnummer);

        expect(result).toEqual({ ok: false, error: 'Mangler identitetsnummer' });
        expect(mockAuthenticatedFetch).not.toHaveBeenCalled();
    });

    it('returnerer tilgang nektet ved 403', async () => {
        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('Tilgang mangler'),
            status: 403,
            backendError: undefined,
        });

        const stoppPeriode = await importStoppPeriode();
        const result = await stoppPeriode('12345678901');

        expect(result).toEqual({ ok: false, error: 'Du har ikke tilgang til denne personen' });
    });

    it('returnerer feilV2 fra backend ved annen feil enn 403', async () => {
        const feilV2Body: KanStartePeriodeFeil = {
            melding: 'Uventet feil mot ekstern tjeneste',
            feilKode: 'UVENTET_FEIL_MOT_EKSTERN_TJENESTE',
        };
        mockAuthenticatedFetch.mockResolvedValue({
            ok: false,
            error: new Error('424 Failed Dependency'),
            status: 424,
            backendError: {
                kind: 'feilV2',
                feilKode: feilV2Body.feilKode,
                melding: feilV2Body.melding,
                rawBody: feilV2Body,
            },
        });

        const stoppPeriode = await importStoppPeriode();
        const result = await stoppPeriode('12345678901');

        expect(result).toEqual({
            ok: false,
            error: '424 Failed Dependency',
            feil: feilV2Body,
        });
    });
});
