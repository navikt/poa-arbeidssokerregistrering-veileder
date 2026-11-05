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
