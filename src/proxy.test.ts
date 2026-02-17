import { NextRequest } from 'next/server';
import { beforeEach, describe, vi } from 'vitest';

vi.mock('@navikt/next-logger', () => ({
    logger: { info: vi.fn(), error: vi.fn() },
}));

vi.mock('@/app/lib/auth/validateToken', () => ({
    validateToken: vi.fn(),
}));

import { validateToken } from '@/app/lib/auth/validateToken';
import { proxy } from '@/proxy';

const mockValidateToken = vi.mocked(validateToken);

function createRequest(path: string, headers?: Record<string, string>): NextRequest {
    return new NextRequest(new URL(path, 'http://localhost:3000'), {
        headers: new Headers(headers),
    });
}
describe('proxy', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('skal slippe igjennom når token er gyldig', async () => {
        mockValidateToken.mockResolvedValue({ ok: true });
        const request = createRequest('/tidslinjer', {
            authorization: 'Bearer valid-token',
        });
        const response = await proxy(request);
        expect(response.status).toBe(200);
        expect(mockValidateToken).toHaveBeenCalledWith('Bearer valid-token');
    });

    it('skal redirecte når token mangler', async () => {
        mockValidateToken.mockResolvedValue({
            ok: false,
            error: new Error('Bearer token is missing'),
            errorType: 'missing-token',
        });

        const request = createRequest('/tidslinjer');
        const response = await proxy(request);

        expect(response.status).toBe(307);
        expect(mockValidateToken).toHaveBeenCalledWith(null);
    });

    it('skal sette riktig redirect-url', async () => {
        vi.stubEnv('NEXT_PUBLIC_SELF_URL', 'https://www.nav.no');
        mockValidateToken.mockResolvedValue({
            ok: false,
            error: new Error('Expired'),
            errorType: 'token expired',
        });
        const request = createRequest('/tidslinjer');
        const response = await proxy(request);
        const location = new URL(response.headers.get('location'));
        expect(location.pathname).toBe('/oauth2/login');
        expect(location.searchParams.get('redirect')).toBe('https://www.nav.no');
    });
});
