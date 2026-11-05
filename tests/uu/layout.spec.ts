import type { Locator, Page, TestInfo } from '@playwright/test';
import { expect, test } from './fixtures';
import { openRoute, routes } from './routes';

const layoutRouteNames = ['Forside med valgt person', 'Arbeidssøkerregistrering', 'Historikk'];
const layoutRoutes = layoutRouteNames.map((name) => {
    const route = routes.find((candidate) => candidate.name === name);
    if (!route) throw new Error(`Missing layout route ${name}`);
    return route;
});

for (const route of layoutRoutes) {
    for (const width of [320, 1280]) {
        test(`${route.name}: layout at ${width}px and text-spacing stress`, async ({ page }, testInfo) => {
            await page.setViewportSize({ width, height: 900 });
            await openRoute(page, route);
            await page.evaluate(async () => {
                await document.fonts.ready;
            });

            const dimensions = await page.evaluate(() => ({
                viewportWidth: document.documentElement.clientWidth,
                documentWidth: document.documentElement.scrollWidth,
            }));
            expect.soft(
                dimensions.documentWidth,
                `${route.path}: document has horizontal overflow at ${width}px; tables are not excluded`,
            ).toBeLessThanOrEqual(dimensions.viewportWidth);

            await expect(usableControl(route.name, page)).toBeVisible();
            const controlBounds = await usableControl(route.name, page).boundingBox();
            expect(controlBounds, `${route.path}: expected an on-screen control`).not.toBeNull();
            if (controlBounds) {
                expect(controlBounds.x, `${route.path}: control starts outside the viewport`).toBeGreaterThanOrEqual(0);
                expect(controlBounds.x + controlBounds.width, `${route.path}: control exceeds the viewport width`).toBeLessThanOrEqual(
                    width,
                );
            }

            await page.addStyleTag({
                content: `
                    main, main * {
                        line-height: 1.5 !important;
                        letter-spacing: 0.12em !important;
                        word-spacing: 0.16em !important;
                    }
                    main p { margin-bottom: 2em !important; }
                `,
            });
            await captureVisualAdvisory(page, testInfo, `${route.name}-${width}-text-spacing`);
        });
    }
}

test('Arbeidssøkerregistrering: 200% root text-size stress', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openRoute(page, routes.find((route) => route.name === 'Arbeidssøkerregistrering')!);
    await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
    });

    const rootFontSize = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
    expect(rootFontSize, 'this is a root text-size stress sample, not browser zoom').toBe('32px');
    await expect(page.getByRole('button', { name: 'Registrer' })).toBeVisible();
    await captureVisualAdvisory(page, testInfo, 'registration-200-percent-root-text-size');
});

test('Historikk: forced-colors rendering sample', async ({ page }, testInfo) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: 320, height: 900 });
    await openRoute(page, routes.find((route) => route.name === 'Historikk')!);

    expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
    await expect(page.getByRole('checkbox', { name: 'Vis innhold ekspandert', exact: true })).toBeVisible();
    await captureVisualAdvisory(page, testInfo, 'history-forced-colors');
});

test('Historikk: reduced-motion rendering sample', async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 900 });
    await openRoute(page, routes.find((route) => route.name === 'Historikk')!);

    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    await expect(page.getByRole('checkbox', { name: 'Vis innhold ekspandert', exact: true })).toBeVisible();
    await captureVisualAdvisory(page, testInfo, 'history-reduced-motion');
});

function usableControl(routeName: string, page: Page): Locator {
    if (routeName === 'Arbeidssøkerregistrering') {
        return page.getByRole('button', { name: 'Registrer' });
    }
    if (routeName === 'Historikk') {
        return page.getByRole('checkbox', { name: 'Vis innhold ekspandert', exact: true });
    }
    return page.getByRole('link', { name: /Se tidligere arbeidssøkerperioder og opplysninger/ });
}

async function captureVisualAdvisory(page: Page, testInfo: TestInfo, state: string): Promise<void> {
    const advisory = await collectClippedTextCandidates(page);
    await testInfo.attach(`visual-advisory-${safeName(state)}.json`, {
        body: JSON.stringify({
            note: 'Advisory only. Review these clipped-text candidates and screenshot; this is not a compliance verdict.',
            state,
            candidates: advisory,
        }, null, 2),
        contentType: 'application/json',
    });
    await testInfo.attach(`visual-advisory-${safeName(state)}.png`, {
        body: await page.screenshot({ fullPage: false, animations: 'disabled' }),
        contentType: 'image/png',
    });
}

async function collectClippedTextCandidates(page: Page): Promise<Array<Record<string, string | number>>> {
    return page.evaluate(() => {
        const candidates: Array<Record<string, string | number>> = [];

        for (const element of Array.from(document.querySelectorAll('body *'))) {
            if (!element.textContent?.trim() || element.getClientRects().length === 0) continue;

            const style = getComputedStyle(element);
            const clipsX = ['hidden', 'clip'].includes(style.overflowX) || style.textOverflow === 'ellipsis';
            const clipsY = ['hidden', 'clip'].includes(style.overflowY);
            const widthClipped = clipsX && element.scrollWidth > element.clientWidth + 1;
            const heightClipped = clipsY && element.scrollHeight > element.clientHeight + 1;
            if (!widthClipped && !heightClipped) continue;

            candidates.push({
                element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}`,
                role: element.getAttribute('role') ?? '',
                ariaLabel: element.getAttribute('aria-label') ?? '',
                clippedAxes: [widthClipped ? 'horizontal' : '', heightClipped ? 'vertical' : '']
                    .filter(Boolean)
                    .join(','),
                clientWidth: element.clientWidth,
                scrollWidth: element.scrollWidth,
                clientHeight: element.clientHeight,
                scrollHeight: element.scrollHeight,
            });
            if (candidates.length === 100) break;
        }

        return candidates;
    });
}

function safeName(name: string): string {
    return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '');
}
