import type { Page } from '@playwright/test';
import { expect, scanPage, test } from './fixtures';
import { openRoute, routes } from './routes';

for (const route of routes) {
    test(`${route.name}: default axe scan`, async ({ page }, testInfo) => {
        await openRoute(page, route);
        await scanPage(page, testInfo, route.path.replaceAll('/', '_') || 'forside');
    });

    test(`${route.name}: document and content structure`, async ({ page }) => {
        await openRoute(page, route);

        const language = await page.locator('html').getAttribute('lang');
        expect(language, 'document language should be a valid Norwegian tag, without forcing a specific variant').toMatch(
            /^(no|nb|nn)(-[a-z0-9]+)*$/i,
        );

        expect((await page.title()).trim(), 'document title should not be empty').not.toBe('');
        expect(await page.locator('main').count(), 'the page should have exactly one main landmark').toBe(1);

        // These are product structure conventions, not axe/WCAG assertions.
        const h1Count = await page.getByRole('heading', { level: 1 }).count();
        expect.soft(h1Count, 'page convention: use one visible level-one heading').toBe(1);

        const headingIssues = await findHeadingHierarchyIssues(page);
        expect.soft(headingIssues, 'page convention: do not skip heading levels').toEqual([]);

        const positiveTabStops = await findPositiveTabStops(page);
        expect.soft(positiveTabStops, 'positive tabindex values disrupt the natural keyboard order').toEqual([]);

        const nestedInteractiveElements = await findNestedInteractiveElements(page);
        expect.soft(nestedInteractiveElements, 'interactive elements must not contain other interactive elements').toEqual(
            [],
        );
    });
}

async function findHeadingHierarchyIssues(page: Page): Promise<string[]> {
    return page.locator('main').locator('h1, h2, h3, h4, h5, h6').evaluateAll((headings) => {
        const visibleLevels = headings
            .filter((heading) => heading.getClientRects().length > 0)
            .map((heading) => Number(heading.tagName.slice(1)));
        const issues: string[] = [];

        for (let index = 1; index < visibleLevels.length; index += 1) {
            const previousLevel = visibleLevels[index - 1];
            const level = visibleLevels[index];
            if (previousLevel !== undefined && level !== undefined && level > previousLevel + 1) {
                issues.push(`h${previousLevel} followed by h${level}`);
            }
        }

        return issues;
    });
}

async function findPositiveTabStops(page: Page): Promise<string[]> {
    return page.locator('[tabindex]').evaluateAll((elements) =>
        elements
            .filter((element) => element.getClientRects().length > 0 && Number(element.getAttribute('tabindex')) > 0)
            .map((element) => {
                const id = element.id ? `#${element.id}` : '';
                const role = element.getAttribute('role');
                return `${element.tagName.toLowerCase()}${id}${role ? `[role=${role}]` : ''}[tabindex=${element.getAttribute('tabindex')}]`;
            }),
    );
}

async function findNestedInteractiveElements(page: Page): Promise<string[]> {
    return page
        .locator('a, button, input, select, textarea, [role="button"], [role="link"], [role="checkbox"]')
        .evaluateAll((elements) => {
            const selector = 'a, button, input, select, textarea, [role="button"], [role="link"], [role="checkbox"]';
            const describe = (element: Element) => {
                const id = element.id ? `#${element.id}` : '';
                const role = element.getAttribute('role');
                return `${element.tagName.toLowerCase()}${id}${role ? `[role=${role}]` : ''}`;
            };
            const visible = (element: Element) => element.getClientRects().length > 0;

            return elements.flatMap((element) => {
                if (!visible(element)) return [];
                const ancestor = element.parentElement?.closest(selector);
                if (!ancestor || !visible(ancestor)) return [];
                return [`${describe(ancestor)} contains ${describe(element)}`];
            });
        });
}
