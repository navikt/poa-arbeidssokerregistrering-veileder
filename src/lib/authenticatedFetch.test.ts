import { beforeEach, expect, vi } from 'vitest';

vi.mock('@/lib/auth/oboToken', () => ({
    getOboTokenFromRequest: vi.fn(),
}));

import { logger } from '@navikt/next-logger';
import { getOboTokenFromRequest } from '@/lib/auth/oboToken';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import type { ProblemDetails } from '@/model/problem-details';

const mockGetOboToken = vi.mocked(getOboTokenFromRequest);

describe('authenticatedFetch', () => {
    const defaultOptions = {
        url: 'https://some-mock-api/hello-world',
        scope: 'api://scope-some-api/.default',
        headers: new Headers({ 'x-trace-id': 'test-trace' }),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('fetch', vi.fn());
    });

    it('skal gi error når OBO token feiler', async () => {
        mockGetOboToken.mockResolvedValue({
            ok: false,
            error: new Error('Token feil'),
        });
        const result = await authenticatedFetch(defaultOptions);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            const { error } = result as { ok: false; error: Error };
            expect(error.message).toBe('Token feil');
        }
        expect(fetch).not.toHaveBeenCalled();
    });

    it('skal returnere data ved vellykket POST', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify({ data: ['some', 'data'], id: 1 }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        const result = await authenticatedFetch<{ data: []; id: number }>({
            ...defaultOptions,
            method: 'POST',
            body: { mockfield: 'lorem' },
        });
        expect(result).toEqual({
            ok: true,
            data: { data: ['some', 'data'], id: 1 },
        });

        expect(fetch).toHaveBeenCalledWith(
            defaultOptions.url,
            expect.objectContaining({ method: 'POST', body: JSON.stringify({ mockfield: 'lorem' }) }),
        );
    });

    it('skal håndtere 500 svar med problem details', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        const problemDetails: ProblemDetails = {
            id: '25614ed9adf8456db',
            type: 'urn:paw:default:ukjent-feil',
            status: 500,
            title: 'Internal Server Error',
            detail: 'Forespørsel feilet med ukjent feil',
            instance: '/api/v3/perioder?ordering=DESC',
            timestamp: '2026-02-12T09:45:40.319246008Z',
        };
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify(problemDetails), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }),
        );
        const result = await authenticatedFetch({
            ...defaultOptions,
            method: 'POST',
            body: { type: 'IDENTITETSNUMMER', identitetsnummer: 'invalid-number' },
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.status).toBe(500);
            expect(result.problemDetails).toEqual(
                expect.objectContaining({
                    type: 'urn:paw:default:ukjent-feil',
                    status: 500,
                    title: 'Internal Server Error',
                    detail: 'Forespørsel feilet med ukjent feil',
                }),
            );
        }
    });

    it('skal håndtere 400 svar med problem details', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        const problemDetails: ProblemDetails = {
            id: 'f030d043-c2e8-4f80-9db0-b700de2c1c9b',
            type: 'urn:paw:http:kunne-ikke-tolke-forespoersel',
            status: 400,
            title: 'Bad Request',
            detail: 'Kunne ikke tolke forespørsel',
            instance: '/api/v3/perioder?ordering=DESC',
            timestamp: '2026-02-12T10:39:15.242466318Z',
        };
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify(problemDetails), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }),
        );
        const result = await authenticatedFetch({
            ...defaultOptions,
            method: 'POST',
            body: { type: 'IDENTITETSNUMMER', identitetsnummer: 'invalid-number' },
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            const { error } = result as { ok: false; error: Error };
            expect(result.status).toBe(400);
            expect(result.problemDetails).toEqual(
                expect.objectContaining({
                    type: 'urn:paw:http:kunne-ikke-tolke-forespoersel',
                    status: 400,
                    title: 'Bad Request',
                    detail: 'Kunne ikke tolke forespørsel',
                }),
            );
        }
    });

    it('skal håndtere feilrespons uten ProblemDetails (f.eks. ren tekst)', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        vi.mocked(fetch).mockResolvedValue(
            new Response('Internal Server Error', { status: 500, statusText: 'Internal Server Error' }),
        );
        const result = await authenticatedFetch(defaultOptions);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.status).toBe(500);
        }
        expect(logger.error).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining(`Feil fra ${defaultOptions.url}:`) }),
        );
        expect(logger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('404'),
                httpStatus: 404,
            }),
        );
    });

    it('skal håndtere 200 med tom body som vellykket resultat', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        vi.mocked(fetch).mockResolvedValue(new Response('', { status: 200 }));

        const result = await authenticatedFetch({
            ...defaultOptions,
            method: 'PUT',
            body: { identitetsnummer: '12345678901', periodeTilstand: 'STARTET' },
        });

        expect(result.ok).toBe(true);
    });

    it('skal håndtere 204 No Content (tom body) som vellykket resultat', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));

        const result = await authenticatedFetch({
            ...defaultOptions,
            method: 'PUT',
            body: { identitetsnummer: '12345678901', periodeTilstand: 'STARTET' },
        });

        expect(result.ok).toBe(true);
    });

    it('skal logge error ved feilrespons med JSON som ikke er ProblemDetails (f.eks. 404 fra aareg)', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify({ message: 'Not Found' }), {
                status: 404,
                statusText: 'Not Found',
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        const result = await authenticatedFetch(defaultOptions);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.status).toBe(404);
        }
        expect(logger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('404'),
                httpStatus: 404,
            }),
        );
    });

    it('skal logge error ved feilrespons med tom JSON-objekt', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify({}), {
                status: 502,
                statusText: 'Bad Gateway',
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        const result = await authenticatedFetch(defaultOptions);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.status).toBe(502);
        }
        expect(logger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('502'),
                httpStatus: 502,
            }),
        );
    });

    it('skal logge error ved feilrespons med JSON-array som body', async () => {
        mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify([{ error: 'something went wrong' }]), {
                status: 500,
                statusText: 'Internal Server Error',
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        const result = await authenticatedFetch(defaultOptions);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.status).toBe(500);
        }
        expect(logger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('500'),
                httpStatus: 500,
            }),
        );
    });

    describe('403 Forbidden — tilgang nektet', () => {
        it('skal returnere status 403', async () => {
            mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
            vi.mocked(fetch).mockResolvedValue(
                new Response(JSON.stringify({ message: 'NAV-ansatt har ikke LESE-tilgang til sluttbruker' }), {
                    status: 403,
                    statusText: 'Forbidden',
                    headers: { 'Content-Type': 'application/json' },
                }),
            );

            const result = await authenticatedFetch(defaultOptions);

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.status).toBe(403);
            }
            expect(logger.warn).toHaveBeenCalledWith(
                expect.objectContaining({
                    event: 'tilgang_nektet',
                    httpStatus: 403,
                }),
            );
        });

        it('skal returnere en generisk feilmelding — ikke lekke sensitiv info fra backend', async () => {
            mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
            vi.mocked(fetch).mockResolvedValue(
                new Response(JSON.stringify({ message: 'NAV-ansatt har ikke LESE-tilgang til sluttbruker' }), {
                    status: 403,
                    statusText: 'Forbidden',
                    headers: { 'Content-Type': 'application/json' },
                }),
            );

            const result = await authenticatedFetch(defaultOptions);

            expect(result.ok).toBe(false);
            if (!result.ok) {
                const { error } = result;
                // Skal IKKE inneholde den rå backend-meldingen
                expect(error.message).not.toContain('LESE-tilgang');
                expect(error.message).not.toContain('sluttbruker');
                // Skal inneholde en generisk, brukervennlig melding
                expect(error.message).toMatch(/tilgang mangler/i);
            }
        });

        it('skal ikke returnere problemDetails ved 403 — unngå informasjonslekkasje', async () => {
            mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
            vi.mocked(fetch).mockResolvedValue(
                new Response(
                    JSON.stringify({
                        type: 'urn:paw:sikkerhet:ikke-tilgang',
                        status: 403,
                        title: 'Forbidden',
                        detail: 'Bruker har strengt fortrolig adresse og kan ikke vises',
                    }),
                    {
                        status: 403,
                        statusText: 'Forbidden',
                        headers: { 'Content-Type': 'application/json' },
                    },
                ),
            );

            const result = await authenticatedFetch(defaultOptions);

            expect(result.ok).toBe(false);
            if (!result.ok) {
                const { error, problemDetails } = result as { ok: false; error: Error; problemDetails?: unknown };
                expect(problemDetails).toBeUndefined();
                expect(error.message).not.toContain('fortrolig');
                expect(error.message).not.toContain('adresse');
            }
        });

        it('skal logge strukturert tilgang_nektet-event for Grafana', async () => {
            mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
            vi.mocked(fetch).mockResolvedValue(
                new Response(JSON.stringify({ message: 'NAV-ansatt har ikke LESE-tilgang til sluttbruker' }), {
                    status: 403,
                    statusText: 'Forbidden',
                    headers: { 'Content-Type': 'application/json' },
                }),
            );

            await authenticatedFetch(defaultOptions);

            expect(logger.warn).toHaveBeenCalledWith(
                expect.objectContaining({
                    event: 'tilgang_nektet',
                    httpStatus: 403,
                }),
            );
        });

        it('skal håndtere 403 med tom body uten å krasje', async () => {
            mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
            vi.mocked(fetch).mockResolvedValue(
                new Response(null, {
                    status: 403,
                    statusText: 'Forbidden',
                }),
            );

            const result = await authenticatedFetch(defaultOptions);

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.status).toBe(403);
                const { error } = result as { ok: false; error: Error };
                expect(error.message).toMatch(/tilgang mangler/i);
            }
        });
    });
});
