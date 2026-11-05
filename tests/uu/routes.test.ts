import type { Locator, Page } from '@playwright/test';
import { describe, expect, it, vi } from 'vitest';
import { openRoute, ROUTE_READY_TIMEOUT_MS, routes } from './routes';

describe('UU-route readiness', () => {
    it('matches the front-page heading with registration details following it', () => {
        const getByRole = vi.fn();
        const page = { getByRole } as unknown as Page;
        const frontPage = routes.find((route) => route.path === '/');

        expect(frontPage).toBeDefined();
        frontPage?.ready(page);

        const name = getByRole.mock.calls[0]?.[1]?.name;
        expect(name).toBeInstanceOf(RegExp);
        expect((name as RegExp).test('Personen er registrert som arbeidssøker\nRegistrert 4. juni av veileder')).toBe(true);
        expect((name as RegExp).test('Personen er registrert som arbeidssøkerhistorikk')).toBe(false);
    });

    it('uses the rendered checkbox role for the history expanded control', () => {
        const getByRole = vi.fn();
        const page = { getByRole } as unknown as Page;
        const history = routes.find((route) => route.path === '/historikk');

        expect(history).toBeDefined();
        history?.ready(page);

        expect(getByRole).toHaveBeenCalledWith('checkbox', {
            name: 'Vis innhold ekspandert',
            exact: true,
        });
    });

    it('fails immediately on a server error status', async () => {
        const errorLocator = makeLocator({ waitFor: async () => undefined, isVisible: async () => false });
        const { page, getByRole } = makePage(503, errorLocator);

        await expect(openRoute(page, { name: 'Unavailable route', path: '/unavailable', ready: () => errorLocator })).rejects.toThrow(
            '/unavailable: application navigation returned HTTP 503',
        );
        expect(getByRole).not.toHaveBeenCalled();
    });

    it('fails promptly with a useful message when the app renders its generic error boundary', async () => {
        const readyLocator = makeLocator({ waitFor: () => new Promise<void>(() => {}), isVisible: async () => false });
        const errorLocator = makeLocator({ waitFor: async () => undefined, isVisible: async () => true });
        const { page } = makePage(200, errorLocator);

        await expect(
            openRoute(page, { name: 'Broken route', path: '/broken', ready: () => readyLocator }),
        ).rejects.toThrow('/broken: application render error: Beklager, noe gikk galt.');
    });

    it('rejects a response status that does not match an expected 404', async () => {
        const readyLocator = makeLocator({ waitFor: async () => undefined, isVisible: async () => true });
        const errorLocator = makeLocator({ waitFor: async () => undefined, isVisible: async () => false });
        const { page, getByRole } = makePage(200, errorLocator);

        await expect(
            openRoute(page, { name: 'Expected 404', path: '/not-found', expectedStatus: 404, ready: () => readyLocator }),
        ).rejects.toThrow('/not-found: expected HTTP 404, received 200');
        expect(getByRole).not.toHaveBeenCalled();
    });

    it('accepts a real 404 only after its not-found content is ready', async () => {
        const readyLocator = makeLocator({ waitFor: async () => undefined, isVisible: async () => true });
        const errorLocator = makeLocator({ waitFor: async () => undefined, isVisible: async () => false });
        const { page } = makePage(404, errorLocator);

        await expect(
            openRoute(page, { name: 'Expected 404', path: '/not-found', expectedStatus: 404, ready: () => readyLocator }),
        ).resolves.toBeDefined();
    });

    it('bounds missing-ready failures instead of waiting for the Playwright test timeout', async () => {
        const readyWait = vi.fn(async () => {
            throw new Error('locator wait ended');
        });
        const readyLocator = makeLocator({ waitFor: readyWait, isVisible: async () => false });
        const errorWait = vi.fn(async () => {
            throw new Error('locator wait ended');
        });
        const errorLocator = makeLocator({ waitFor: errorWait, isVisible: async () => false });
        const { page } = makePage(200, errorLocator);

        await expect(openRoute(page, { name: 'Slow route', path: '/slow', ready: () => readyLocator })).rejects.toThrow(
            `/slow: route did not become ready within ${ROUTE_READY_TIMEOUT_MS}ms`,
        );
        expect(readyWait).toHaveBeenCalledWith({ state: 'visible', timeout: ROUTE_READY_TIMEOUT_MS });
        expect(errorWait).toHaveBeenCalledWith({ state: 'visible', timeout: ROUTE_READY_TIMEOUT_MS });
    });
});

function makeLocator(behavior: { waitFor: () => Promise<void>; isVisible: () => Promise<boolean> }): Locator {
    return {
        waitFor: vi.fn(behavior.waitFor),
        isVisible: vi.fn(behavior.isVisible),
    } as unknown as Locator;
}

function makePage(
    status: number,
    errorLocator: Locator,
): { page: Page; getByRole: ReturnType<typeof vi.fn> } {
    const getByRole = vi.fn(() => errorLocator);
    const page = {
        goto: vi.fn(async () => ({ status: () => status })),
        getByRole,
    } as unknown as Page;
    return { page, getByRole };
}
