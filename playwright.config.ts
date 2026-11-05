import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const allBrowsers = process.env.UU_ALL_BROWSERS === '1';
const networkInterceptor = fileURLToPath(
    new URL('tests/uu/network.mjs', pathToFileURL(`${process.cwd()}/`)),
);
const isListMode = process.argv.some((argument) => argument === '--list' || argument === '--list=true');
const browserProjects = [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ...(allBrowsers
        ? [
              { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
              { name: 'webkit', use: { ...devices['Desktop Safari'] } },
          ]
        : []),
];

export default defineConfig({
    testDir: './tests/uu',
    testMatch: '**/*.spec.ts',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    timeout: 60_000,
    expect: { timeout: 10_000 },
    reporter: isListMode
        ? [['list']]
        : [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
    outputDir: 'test-results/uu',
    use: {
        baseURL: 'http://127.0.0.1:3100',
        trace: 'retain-on-failure',
    },
    projects: browserProjects,
    webServer: [
        {
            command: 'pnpm exec next dev --webpack --hostname 127.0.0.1 --port 3100',
            url: 'http://127.0.0.1:3100/api/isready',
            reuseExistingServer: false,
            timeout: 180_000,
            env: {
                ENABLE_MOCK: 'enabled',
                NEXT_PUBLIC_ENABLE_MOCK: 'enabled',
                NAIS_CLUSTER_NAME: 'local-uu',
                NEXT_PUBLIC_ASSET_PREFIX: '',
                NEXT_TELEMETRY_DISABLED: '1',
                NEXT_PUBLIC_FARO_URL: '',
                NEXT_PUBLIC_FARO_APP_NAME: '',
                NEXT_PUBLIC_UMAMI_TRACKING_ID: '',
                NODE_OPTIONS: `--import="${networkInterceptor}"`,
            },
        },
        {
            command:
                'pnpm exec storybook dev --ci --no-open --disable-telemetry --host 127.0.0.1 --port 6106 --config-dir .storybook-uu',
            url: 'http://127.0.0.1:6106/index.json',
            reuseExistingServer: false,
            timeout: 180_000,
            env: {
                STORYBOOK_DISABLE_TELEMETRY: '1',
                NEXT_TELEMETRY_DISABLED: '1',
            },
        },
    ],
});

// Chromium is the default. Set UU_ALL_BROWSERS=1 to also run Firefox and WebKit;
// install those engines with `pnpm exec playwright install firefox webkit` first.
