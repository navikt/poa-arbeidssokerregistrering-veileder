import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('@navikt/next-logger', () => ({
	logger: { info: vi.fn(), error: vi.fn() },
}));

vi.mock('@navikt/oasis', () => ({
	getToken: vi.fn(),
	requestAzureOboToken: vi.fn(),
}));

vi.mock('./validateToken', () => ({
	validateToken: vi.fn(),
}));

import { getToken, requestAzureOboToken } from '@navikt/oasis';
import { getOboTokenFromRequest } from './oboToken';
import { validateToken } from './validateToken';

const mockGetToken = vi.mocked(getToken);
const mockValidateToken = vi.mocked(validateToken);
const mockRequestObo = vi.mocked(requestAzureOboToken);

describe('getOboTokenFromRequest', () => {
	const fakeHeaders = new Headers({ authorization: 'Bearer test-token' });
	const scope = 'api://some-cluster.paw.some-app/.default';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('skal returnere feil når getToken ikke finner token i headers', async () => {
		mockGetToken.mockReturnValue(null);

		const result = await getOboTokenFromRequest(fakeHeaders, scope);

		expect(result.ok).toBe(false);
		if (!result.ok) {
			const { error } = result as { ok: false; error: Error };
			expect(error.message).toContain('Ingen token funnet');
		}
		// Skal ikke gå videre til validering
		expect(mockValidateToken).not.toHaveBeenCalled();
	});

	it('skal returnere feil når token-validering feiler', async () => {
		mockGetToken.mockReturnValue('incoming-token');
		mockValidateToken.mockResolvedValue({
			ok: false,
			errorType: 'token expired',
			error: new Error('expired'),
		});

		const result = await getOboTokenFromRequest(fakeHeaders, scope);

		expect(result.ok).toBe(false);
		if (!result.ok) {
			const { error } = result as { ok: false; error: Error };
			expect(error.message).toContain('Ugyldig token');
		}
		// Skal ikke gå videre til OBO-utveksling
		expect(mockRequestObo).not.toHaveBeenCalled();
	});

	it('skal returnere feil når OBO-tokenutveksling feiler', async () => {
		mockGetToken.mockReturnValue('incoming-token');
		mockValidateToken.mockResolvedValue({ ok: true });
		mockRequestObo.mockResolvedValue({
			ok: false,
			error: new Error('OBO failed'),
		});

		const result = await getOboTokenFromRequest(fakeHeaders, scope);

		expect(result.ok).toBe(false);
		if (!result.ok) {
			const { error } = result as { ok: false; error: Error };
			expect(error.message).toContain(scope);
		}
	});

	it('skal returnere OBO-token ved suksess', async () => {
		mockGetToken.mockReturnValue('incoming-token');
		mockValidateToken.mockResolvedValue({ ok: true });
		mockRequestObo.mockResolvedValue({ ok: true, token: 'obo-token-xyz' });

		const result = await getOboTokenFromRequest(fakeHeaders, scope);

		expect(result).toEqual({ ok: true, token: 'obo-token-xyz' });
		expect(mockRequestObo).toHaveBeenCalledWith('incoming-token', scope);
	});
});
