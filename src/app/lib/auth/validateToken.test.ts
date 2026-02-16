import { beforeEach, expect, vi } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('@navikt/oasis', () => ({
    validateAzureToken: vi.fn(),
}));

import { validateAzureToken } from '@navikt/oasis';
import { validateToken } from '@/app/lib/auth/validateToken';

const mockeValidatedAzureToken = vi.mocked(validateAzureToken);

describe('validateToken', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // pga enableMock
    });

    it('skal returnere feil når bearerToken er null', async () => {
        const result = await validateToken(null);

        expect(result.ok).toBe(false);

        if (!result.ok) {
            const { errorType } = result as { ok: false; errorType: string; error: Error };
            expect(errorType).toBe('missing-token');
        }
        expect(mockeValidatedAzureToken).not.toHaveBeenCalled();
    });

    it('skal returnere vellykket når Azure token er gyldig', async () => {
        mockeValidatedAzureToken.mockResolvedValue({ ok: true, payload: {} });
        const result = await validateToken('Bearer valid-token');
        expect(result.ok).toBe(true);
        expect(mockeValidatedAzureToken).toHaveBeenCalledWith('Bearer valid-token');
    });

    it('skal returnere feil når Azure token ikke er gyldig', async () => {
        const tokenError = new Error('Token expired');
        mockeValidatedAzureToken.mockResolvedValue({
            ok: false,
            errorType: 'token expired',
            error: tokenError,
        });

        const result = await validateToken('Bearer expired-token');
        expect(result.ok).toBe(false);
        if (!result.ok) {
            const { errorType, error } = result as { ok: false; errorType: string; error: Error };
            expect(errorType).toBe('token expired');
            expect(error).toBe(tokenError);
        }
    });
});

// Egen describe side env-variablene må "resettes"
describe('validateToken (på localhost)', () => {
    it('skal returnere ok når ENABLE_MOCK er aktivt', async () => {
        vi.resetModules();
        vi.stubEnv('ENABLE_MOCK', 'enabled');
        vi.mock('server-only', () => ({}));
        vi.mock('@navikt/oasis', () => ({ validateAzureToken: vi.fn() }));

        const { validateToken: validateTokenMocked } = await import('@/app/lib/auth/validateToken');
        const result = await validateTokenMocked(null);

        expect(result.ok).toBe(true);
        vi.unstubAllEnvs();
    });
});
