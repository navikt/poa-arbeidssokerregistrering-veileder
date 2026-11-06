import AxeBuilder from '@axe-core/playwright';
import { expect, test as playwrightTest, type Locator, type Page, type TestInfo } from '@playwright/test';

type UuFixtures = {
    page: Page;
};

const test = playwrightTest.extend<UuFixtures>({
    page: async ({ page }, use, testInfo) => {
        const blockedRequests: string[] = [];

        // Hide only Next.js development tooling. This portal is outside the product UI.
        await page.addInitScript(() => {
            const hideDevtools = () => {
                document.querySelectorAll('nextjs-portal').forEach((portal) => {
                    if (portal instanceof HTMLElement) portal.style.setProperty('display', 'none', 'important');
                });
            };
            new MutationObserver(hideDevtools).observe(document, { childList: true, subtree: true });
        });

        await page.route('**/*', async (route) => {
            const requestUrl = new URL(route.request().url());

            if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
                await route.abort();
                return;
            }

            if (isAkselFontUrl(requestUrl)) {
                await route.continue();
                return;
            }

            if (isVisittkortStubUrl(requestUrl)) {
                await route.fulfill({ status: 200, contentType: 'text/javascript', body: 'export {};' });
                return;
            }

            if (isFaroCollectorUrl(requestUrl)) {
                await route.fulfill({ status: 204, body: '' });
                return;
            }

            if (isAllowedLoopbackUrl(requestUrl)) {
                await route.continue();
                return;
            }

            // Keep reports free of query strings, which may contain tokens or identifiers.
            blockedRequests.push(`${requestUrl.origin}${requestUrl.pathname}`);
            await route.abort();
        });

        await use(page);

        await testInfo.attach('blocked-external-browser-requests.json', {
            body: JSON.stringify({ count: blockedRequests.length, requests: blockedRequests }, null, 2),
            contentType: 'application/json',
        });
    },
});

function isAllowedLoopbackUrl(url: URL): boolean {
    const isLoopbackHost = ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(url.hostname);
    return (
        url.protocol === 'http:' &&
        ((isLoopbackHost && ['3100', '6106'].includes(url.port)) ||
            (['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname) && url.port === '12347'))
    );
}

function isAkselFontUrl(url: URL): boolean {
    return url.href.match(/^https:\/\/cdn\.nav\.no\/aksel\/fonts\/SourceSans3-[^/?#]+\.woff2$/) !== null;
}

function isVisittkortStubUrl(url: URL): boolean {
    return url.href === 'https://cdn.nav.no/poao/veilarbvisittkortfs-dev/build/uu-stub.js';
}

function isFaroCollectorUrl(url: URL): boolean {
    return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname) && url.port === '12347';
}

async function scanPage(page: Page, testInfo: TestInfo, state: string): Promise<void> {
    await expect(page.locator('body')).toHaveCount(1);
    await expect(page.locator('main')).toBeVisible();
    const mainText = (await page.locator('main').innerText()).trim();
    expect(mainText.length, `${state}: main landmark must contain rendered, meaningful content`).toBeGreaterThan(0);

    const fontState = await page.evaluate(async () => {
        await document.fonts.ready;
        const failedFaces = Array.from(document.fonts).filter((fontFace) => fontFace.status === 'error');
        const visibleText = Array.from(document.querySelectorAll('body *')).filter(
            (element) => element.textContent?.trim() && element.getClientRects().length > 0,
        );

        const usedFailedFaces = failedFaces.filter((fontFace) => {
            const family = fontFace.family.replaceAll(/["']/g, '').trim().toLowerCase();
            return visibleText.some((element) => {
                const style = getComputedStyle(element);
                const firstFamily = style.fontFamily.split(',')[0]?.replaceAll(/["']/g, '').trim().toLowerCase();
                const requestedWeight = style.fontWeight === 'normal' ? '400' : style.fontWeight === 'bold' ? '700' : style.fontWeight;
                const faceWeights = fontFace.weight.split(/\s+/).map((weight) => (weight === 'normal' ? '400' : weight === 'bold' ? '700' : weight));
                const weightMatches =
                    faceWeights.length > 1 && Number(requestedWeight) >= Number(faceWeights[0])
                        ? Number(requestedWeight) <= Number(faceWeights[1])
                        : faceWeights[0] === requestedWeight;
                return (
                    firstFamily === family &&
                    style.fontStyle === fontFace.style &&
                    weightMatches
                );
            });
        });

        return {
            status: document.fonts.status,
            failedFaces: usedFailedFaces.map((fontFace) => ({
                family: fontFace.family,
                style: fontFace.style,
                weight: fontFace.weight,
            })),
        };
    });
    await testInfo.attach(`font-loading-${state}.json`, {
        body: JSON.stringify(fontState, null, 2),
        contentType: 'application/json',
    });
    expect.soft(fontState.failedFaces, `${state}: font loading failed`).toEqual([]);

    // axe-core 4.14 disables this stable WCAG 2.2 AA rule by default. Keep every default rule and enable only target-size;
    // do not use withRules, which would filter the rest of axe's default rule set.
    const results = await new AxeBuilder({ page }).options({ rules: { 'target-size': { enabled: true } } }).analyze();
    await testInfo.attach(`axe-${state}.json`, {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
    });

    const summary = {
        state,
        violations: results.violations.map(({ id, impact, nodes }) => ({ id, impact, affectedNodes: nodes.length })),
        incomplete: results.incomplete.map(({ id, impact, nodes }) => ({ id, impact, reviewNodes: nodes.length })),
        passes: results.passes.length,
        inapplicable: results.inapplicable.length,
    };
    await testInfo.attach(`axe-summary-${state}.json`, {
        body: JSON.stringify(summary, null, 2),
        contentType: 'application/json',
    });

    for (const rule of summary.incomplete) {
        testInfo.annotations.push({
            type: 'manual-review',
            description: `${state}: manually review incomplete axe rule ${rule.id} (${rule.reviewNodes} candidate nodes)`,
        });
    }

    expect.soft(results.violations, `${state}: axe violations`).toEqual([]);
}

async function tabTo(page: Page, target: Locator): Promise<void> {
    await expect(target, 'Keyboard Tab target must match exactly one element').toHaveCount(1);
    await expect(target).toBeVisible();
    if (await target.evaluate((element) => element === document.activeElement)) {
        return;
    }

    for (let tabCount = 0; tabCount < 100; tabCount += 1) {
        await page.keyboard.press('Tab');
        if (await target.evaluate((element) => element === document.activeElement)) {
            return;
        }
    }

    throw new Error('Keyboard Tab did not reach the requested target within 100 key presses');
}

export { expect, test, scanPage, tabTo };
