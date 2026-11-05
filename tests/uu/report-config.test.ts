import { afterEach, describe, expect, it, vi } from 'vitest';

const originalArgv = process.argv;

afterEach(() => {
    process.argv = originalArgv;
    vi.resetModules();
});

async function loadPlaywrightConfig(args: string[] = []) {
    process.argv = [process.argv[0] ?? 'node', ...args];
    vi.resetModules();
    return (await import('../../playwright.config')).default;
}

describe('Playwright reporter selection', () => {
    it('keeps the HTML report and list reporter for normal runs', async () => {
        const config = await loadPlaywrightConfig();

        expect(config.reporter).toEqual([
            ['html', { outputFolder: 'playwright-report', open: 'never' }],
            ['list'],
        ]);
    });

    it('uses only the list reporter for --list', async () => {
        const config = await loadPlaywrightConfig(['--list']);

        expect(config.reporter).toEqual([['list']]);
    });

    it('uses only the list reporter for --list=true', async () => {
        const config = await loadPlaywrightConfig(['--list=true']);

        expect(config.reporter).toEqual([['list']]);
    });
});

describe('Playwright web server and local defaults', () => {
    it('configures only the mocked Next.js web server', async () => {
        const config = await loadPlaywrightConfig();
        const webServers = Array.isArray(config.webServer) ? config.webServer : [config.webServer];

        expect(webServers).toHaveLength(1);
        expect(webServers[0]?.url).toBe('http://127.0.0.1:3100/api/isready');
        expect(webServers[0]?.command).toContain('next dev');
        expect(webServers[0]?.env).toMatchObject({
            ENABLE_MOCK: 'enabled',
            NEXT_PUBLIC_ENABLE_MOCK: 'enabled',
            NAIS_CLUSTER_NAME: 'local-uu',
        });
        expect(webServers[0]?.command).not.toContain('storybook');
    });

    it('keeps single-worker non-parallel defaults for local runs', async () => {
        const config = await loadPlaywrightConfig();

        expect(config.workers).toBe(1);
        expect(config.fullyParallel).toBe(false);
    });
});
