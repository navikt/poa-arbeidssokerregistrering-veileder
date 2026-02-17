import { beforeEach, expect, vi } from 'vitest';

vi.mock('@navikt/next-logger', () => ({
	logger: { info: vi.fn(), error: vi.fn() },
}));

vi.mock('@/app/lib/auth/oboToken', () => ({
	getOboTokenFromRequest: vi.fn(),
}));

import { logger } from '@navikt/next-logger';
import { getOboTokenFromRequest } from '@/app/lib/auth/oboToken';
import { authenticatedFetch } from '@/app/lib/authenticatedFetch';
import type { ProblemDetails } from './types/problem-details';

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
			const { error } = result as { ok: false; error: Error };
			expect(error.message).toContain('500');
			expect(error.message).toContain('Internal Server Error');
			expect(error.message).toContain('Forespørsel feilet med ukjent feil');
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
			expect(error.message).toContain('400');
			expect(error.message).toContain('Bad Request');
			expect(error.message).toContain('Kunne ikke tolke forespørsel');
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
			const { error } = result as { ok: false; error: Error };
			expect(error.message).toBe('500 Internal Server Error');
		}
		expect(logger.error).toHaveBeenCalledWith(
			expect.objectContaining({ message: expect.stringContaining('Feil fra API:') }),
		);
	});
});
