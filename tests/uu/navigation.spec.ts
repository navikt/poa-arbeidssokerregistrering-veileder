import { expect, scanPage, test } from './fixtures';
import { getRadioGroup, selectRadioByKeyboard } from './forms';
import { tabTo } from './fixtures';
import { gotoReady } from './routes';

async function enterWithKeyboard(page: import('@playwright/test').Page, button: import('@playwright/test').Locator) {
    await tabTo(page, button);
    await page.keyboard.press('Enter');
}

async function expectFocusNotOnBody(page: import('@playwright/test').Page, state: string) {
    await expect.soft
        .poll(() => page.evaluate(() => document.activeElement?.tagName ?? ''), {
            message: `Focus should not fall to the body after ${state}`,
            timeout: 2_000,
        })
        .not.toBe('BODY');
}

test.describe('Tastaturnavigasjon', () => {
    test('bekreftelse varsler når personen ikke vil fortsette', async ({ page }, testInfo) => {
        await gotoReady(page, '/bekreftelse');
        const workGroup = page.getByRole('radiogroup', { name: /Har personen vært i arbeid i perioden/ }).first();
        const continueGroup = getRadioGroup(page, 'Vil personen fortsatt være registrert som arbeidssøker?');
        await expect(workGroup).toBeVisible();
        await scanPage(page, testInfo, 'confirmation initial');

        const firstWorkOption = workGroup.getByRole('radio').first();
        await tabTo(page, firstWorkOption);
        await page.keyboard.press('ArrowDown');
        await expect(workGroup.getByRole('radio', { name: 'Nei', exact: true })).toBeChecked();
        await page.keyboard.press('Tab');
        await expect(continueGroup.getByRole('radio').first()).toBeFocused();
        await selectRadioByKeyboard(page, continueGroup, 'Nei');
        await expect(page.getByText('Bruker vil ikke lenger være registrert som arbeidssøker, og eventuell pengestøtte vil stanses.', { exact: true })).toBeVisible();
        await scanPage(page, testInfo, 'confirmation stop warning');
    });

    test('bekreftelse sendes inn og neste periode kan besvares med tastatur', async ({ page }, testInfo) => {
        await gotoReady(page, '/bekreftelse');
        const workGroup = page.getByRole('radiogroup', { name: /Har personen vært i arbeid i perioden/ }).first();
        const continueGroup = getRadioGroup(page, 'Vil personen fortsatt være registrert som arbeidssøker?');
        await expect(workGroup).toBeVisible();
        const currentPeriodPrompt = await workGroup.innerText();
        await selectRadioByKeyboard(page, workGroup, 'Ja');
        await selectRadioByKeyboard(page, continueGroup, 'Ja');
        await scanPage(page, testInfo, 'confirmation complete answers');

        const submit = page.getByRole('button', { name: 'Send inn', exact: true });
        await enterWithKeyboard(page, submit);
        await expect(page.getByRole('heading', { name: 'Bekreftelsen er registrert' })).toBeVisible();
        await expectFocusNotOnBody(page, 'confirmation submission');
        await scanPage(page, testInfo, 'confirmation receipt with next period');

        const next = page.getByRole('button', { name: 'Svar for neste periode', exact: true });
        await enterWithKeyboard(page, next);
        await expect(workGroup).toBeVisible();
        await expect.poll(() => workGroup.innerText()).not.toBe(currentPeriodPrompt);
        await expectFocusNotOnBody(page, 'moving to the next confirmation period');
        await scanPage(page, testInfo, 'next confirmation period');
    });

    test('arbeidssøkerperiode kan avsluttes med Enter', async ({ page }, testInfo) => {
        await gotoReady(page, '/avslutt-arbeidssoekerperiode');
        const endButton = page.getByRole('button', { name: 'Avslutt arbeidssøkerperioden', exact: true });
        await expect(endButton).toBeVisible();
        await scanPage(page, testInfo, 'end period confirmation');
        await enterWithKeyboard(page, endButton);

        await expect(page).toHaveURL(/\/arbeidssoekerperiode-er-avsluttet$/);
        await expect(page.getByRole('heading', { name: 'Arbeidssøkerperioden er avsluttet', level: 1 })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Arbeidssøkerperioden er avsluttet', level: 1 })).toBeFocused();
        await scanPage(page, testInfo, 'end period receipt');
    });

    test('arbeidssøkerperiode kan slettes med Space og Enter', async ({ page }, testInfo) => {
        await gotoReady(page, '/slett-arbeidssoekerperiode');
        const confirmation = page.getByRole('checkbox', {
            name: 'Jeg bekrefter at arbeidssøkerperioden skal slettes på grunn av feilregistrering',
            exact: true,
        });
        const deleteButton = page.getByRole('button', { name: 'Slett arbeidssøkerperioden', exact: true });
        await expect(confirmation).toBeVisible();
        await expect(deleteButton).toBeDisabled();
        await scanPage(page, testInfo, 'delete period confirmation');

        await tabTo(page, confirmation);
        await confirmation.press('Space');
        await expect(confirmation).toBeChecked();
        await expect(deleteButton).toBeEnabled();
        await enterWithKeyboard(page, deleteButton);

        await expect(page).toHaveURL(/\/arbeidssoekerperiode-er-slettet$/);
        await expect(page.getByRole('heading', { name: 'Arbeidssøkerperioden er slettet', level: 1 })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Arbeidssøkerperioden er slettet', level: 1 })).toBeFocused();
        await scanPage(page, testInfo, 'delete period receipt');
    });

    test('historikkmenyen lukkes med Escape og returnerer fokus', async ({ page }, testInfo) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await gotoReady(page, '/historikk');
        const menuButton = page.getByRole('button', { name: /Arbeidssøkerperioder?\s*\(/ }).first();
        await expect(menuButton).toBeVisible();
        await scanPage(page, testInfo, 'history menu closed');

        await tabTo(page, menuButton);
        await page.keyboard.press('Enter');
        await expect(page.getByRole('menu')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('menu')).toBeHidden();
        await expect.soft(menuButton).toBeFocused();
        await scanPage(page, testInfo, 'history menu closed with Escape');
    });

    test('historikkfilter og ekspandert visning kan styres med tastatur', async ({ page }, testInfo) => {
        await gotoReady(page, '/historikk');
        const eventHeading = page.getByRole('heading', { name: 'Opplysninger sendt', exact: true }).first();
        const filter = page.getByRole('button', { name: 'Opplysninger sendt', exact: true });
        await expect(eventHeading).toBeVisible();
        await scanPage(page, testInfo, 'history initial');

        await tabTo(page, filter);
        await page.keyboard.press('Space');
        await expect(page.getByRole('heading', { name: 'Opplysninger sendt', exact: true })).toHaveCount(0);
        await scanPage(page, testInfo, 'history filtered');

        const reset = page.getByRole('button', { name: 'Nullstill filter', exact: true });
        await tabTo(page, reset);
        await page.keyboard.press('Enter');
        await expect(eventHeading).toBeVisible();

        const expanded = page.getByRole('checkbox', { name: 'Vis innhold ekspandert', exact: true });
        await tabTo(page, expanded);
        await page.keyboard.press('Space');
        await expect(expanded).toBeChecked();
        const details = page.getByRole('button', { name: 'Se innsendte opplysninger', exact: true }).first();
        await expect(details).toHaveAttribute('aria-expanded', 'true');
        await scanPage(page, testInfo, 'history expanded details');
    });

    test('tidslinjeinnhold kan åpnes fra accordion med tastatur', async ({ page }, testInfo) => {
        await gotoReady(page, '/tidslinjer');
        const period = page.getByRole('button', { name: /fortsatt pågående/ }).first();
        await expect(period).toBeVisible();
        await scanPage(page, testInfo, 'timeline closed');

        await tabTo(page, period);
        await page.keyboard.press('Enter');
        await expect(page.getByRole('table').first()).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Tidspunkt', exact: true })).toBeVisible();
        await scanPage(page, testInfo, 'timeline expanded');
    });
});
