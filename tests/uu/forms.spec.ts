import { expect, scanPage, test } from './fixtures';
import { fillRegistration, getRadioGroup, hasValidationFocus, selectNamedRadio } from './forms';
import { tabTo } from './fixtures';

const SITUASJON = 'Velg den situasjonen som passer deg best';
const ERROR_TEXT = 'Du må svare på spørsmålet før du kan registrere arbeidssøkeren.';

async function submitWithKeyboard(page: import('@playwright/test').Page, label: string) {
    const submit = page.getByRole('button', { name: label, exact: true });
    await tabTo(page, submit);
    await page.keyboard.press('Enter');
}

async function expectErrorAssociated(page: import('@playwright/test').Page, group: import('@playwright/test').Locator) {
    const groupCount = await group.count();
    expect(groupCount, `Expected one rendered field group for validation error: ${ERROR_TEXT}`).toBe(1);
    await expect(group).toBeVisible();
    const association = await group.evaluate((element, errorText) => {
        const nodes = [element, ...Array.from(element.querySelectorAll<HTMLElement>('*'))];
        const invalid = nodes.some((node) => node.getAttribute('aria-invalid') === 'true');
        const describedIds = nodes.flatMap((node) => (node.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
        const describedError = describedIds
            .map((id) => document.getElementById(id))
            .find((described) => described?.textContent?.trim() === errorText);
        return {
            invalid,
            describesError: describedError !== undefined,
            errorVisible: Boolean(describedError && describedError.getClientRects().length > 0),
        };
    }, ERROR_TEXT);
    expect.soft(association.invalid, 'The field group should expose its invalid state').toBe(true);
    expect.soft(association.describesError, 'aria-describedby should point to this group\'s validation error').toBe(true);
    expect.soft(association.errorVisible, 'The associated validation error should be visible').toBe(true);
}

async function expectFormGroupNames(page: import('@playwright/test').Page) {
    const names = [
        SITUASJON,
        'Hva er din høyeste fullførte utdanning?',
        'Er utdanningen din godkjent i Norge?',
        'Er utdanningen din bestått?',
        'Har du helseproblemer som hindrer deg i å søke eller være i jobb?',
        'Har du andre problemer med å søke eller være i jobb?',
    ];
    for (const name of names) {
        await expect.soft(getRadioGroup(page, name), `radiogroup name: ${name}`).toHaveCount(1);
    }

    const lastJobRadio = page.getByRole('radio', { name: 'Har vært i jobb', exact: true });
    const lastJobGroup = page.getByRole('radiogroup').filter({ has: lastJobRadio });
    await expect.soft(lastJobGroup, 'Expected one radio group containing the last-job choice').toHaveCount(1);
    await expect.soft(lastJobGroup).toHaveAccessibleName(/\S{3,}/);
}

test.describe('Skjemaer med tastatur', () => {
    test('viser feltfeil med tilknytning til alle synlige, ubesvarte grupper', async ({ page }, testInfo) => {
        await page.goto('/registrering-arbeidssoker');
        await expect(page.getByRole('heading', { name: 'Arbeidssøkerregistrering', level: 1 })).toBeVisible();
        await selectNamedRadio(page, SITUASJON, 'Er usikker på jobbsituasjonen min');
        await selectNamedRadio(page, 'Hva er din høyeste fullførte utdanning?', 'Videregående, fagbrev eller svennebrev (3 år eller mer)');
        await expectFormGroupNames(page);
        await submitWithKeyboard(page, 'Registrer');

        const fieldGroups = [
            page.getByRole('radiogroup').filter({ has: page.getByRole('radio', { name: 'Har vært i jobb', exact: true }) }),
            getRadioGroup(page, 'Er utdanningen din godkjent i Norge?'),
            getRadioGroup(page, 'Er utdanningen din bestått?'),
            getRadioGroup(page, 'Har du helseproblemer som hindrer deg i å søke eller være i jobb?'),
            getRadioGroup(page, 'Har du andre problemer med å søke eller være i jobb?'),
        ];
        for (const group of fieldGroups) {
            await expect.soft(group).toBeVisible();
            await expectErrorAssociated(page, group);
        }
        await scanPage(page, testInfo, 'registration validation errors');
    });

    test('flytter fokus til feiloversikt eller første ugyldige felt etter innsending', async ({ page }) => {
        await page.goto('/registrering-arbeidssoker');
        await expect(page.getByRole('button', { name: 'Registrer', exact: true })).toBeVisible();
        await submitWithKeyboard(page, 'Registrer');

        await expect.soft
            .poll(
                async () =>
                    (await page.locator('[aria-invalid="true"]').count()) > 0 ||
                    (await page.getByText(ERROR_TEXT, { exact: true }).count()) > 0,
                { timeout: 1500, message: 'Validation errors should be rendered before checking focus' },
            )
            .toBe(true);
        await expect.soft.poll(() => page.evaluate(hasValidationFocus), {
            timeout: 2_000,
            message: 'Focus should move to a summary or the first invalid field',
        }).toBe(true);
    });

    test('registrering kan fylles med tastatur og utvider hjelpetekst', async ({ page }, testInfo) => {
        await page.goto('/registrering-arbeidssoker');
        await expect(getRadioGroup(page, SITUASJON)).toBeVisible();
        await scanPage(page, testInfo, 'registration initial');

        const situationFirst = getRadioGroup(page, SITUASJON).getByRole('radio').first();
        await tabTo(page, situationFirst);
        await page.keyboard.press('ArrowDown');
        await expect(getRadioGroup(page, SITUASJON).getByRole('radio', { name: 'Har sagt opp eller kommer til å si opp' })).toBeChecked();
        const changeButton = page.getByRole('button', { name: 'Endre', exact: true });
        const help = page.getByRole('button', { name: 'Hva bruker vi informasjonen om siste stilling til?', exact: true });
        const utdanningFirst = getRadioGroup(page, 'Hva er din høyeste fullførte utdanning?').getByRole('radio').first();
        await page.keyboard.press('Tab');
        await expect.soft(changeButton).toBeFocused();
        await page.keyboard.press('Tab');
        await expect.soft(help).toBeFocused();
        await page.keyboard.press('Tab');
        await expect.soft(utdanningFirst).toBeFocused();

        await fillRegistration(page);
        await expect(getRadioGroup(page, 'Er utdanningen din godkjent i Norge?')).toBeVisible();
        await expect(getRadioGroup(page, 'Er utdanningen din bestått?')).toBeVisible();
        await expect(getRadioGroup(page, 'Har du helseproblemer som hindrer deg i å søke eller være i jobb?')).toBeVisible();
        await expect(getRadioGroup(page, 'Har du andre problemer med å søke eller være i jobb?')).toBeVisible();
        await expectFormGroupNames(page);

        await tabTo(page, help);
        await page.keyboard.press('Enter');
        await expect(page.getByText('Vi bruker opplysningene til å lage offentlig statistikk om arbeidsmarkedet.', { exact: false })).toBeVisible();
        await scanPage(page, testInfo, 'registration help expanded');

        await submitWithKeyboard(page, 'Registrer');
        await expect(page).toHaveURL(/\/kvittering-arbeidssoker$/);
        await expect(page.getByRole('heading', { name: 'Personen er registrert som arbeidssøker', level: 1 })).toBeVisible();
        await scanPage(page, testInfo, 'registration receipt');
    });

    test('opplysninger kan oppdateres med tastatur', async ({ page }, testInfo) => {
        await page.goto('/oppdater-opplysninger');
        await expect(getRadioGroup(page, SITUASJON)).toBeVisible();
        await scanPage(page, testInfo, 'update initial');
        await fillRegistration(page);
        await expectFormGroupNames(page);
        await submitWithKeyboard(page, 'Oppdater');

        await expect(page).toHaveURL(/\/kvittering-oppdatert-opplysninger$/);
        await expect(page.getByRole('heading', { name: 'Opplysningene er oppdatert', level: 1 })).toBeVisible();
        await scanPage(page, testInfo, 'update receipt');
    });

    test('stilling kan endres fra combobox med tastatur og fokus returnerer til Endre', async ({ page }, testInfo) => {
        await page.route('**/api/stillingssok**', (route) =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ konseptId: 97001, label: 'Sykepleier', styrk08: '2221' }]),
            }),
        );
        await page.goto('/oppdater-opplysninger');
        await expect(page.getByRole('button', { name: 'Endre', exact: true })).toBeVisible();
        const changeButton = page.getByRole('button', { name: 'Endre', exact: true });
        await tabTo(page, changeButton);
        await page.keyboard.press('Enter');

        const combobox = page.getByRole('combobox', { name: 'Søk etter stilling', exact: true });
        await expect(combobox).toBeVisible();
        await expect.soft(combobox, 'Opening the search should move focus into the combobox').toBeFocused();
        await tabTo(page, combobox);
        const results = page.waitForResponse((response) => response.url().includes('/api/stillingssok') && response.status() === 200);
        await combobox.fill('sykepleier');
        await results;
        await expect(page.getByRole('option', { name: 'Sykepleier', exact: true })).toBeVisible();
        await combobox.press('ArrowDown');
        await combobox.press('Enter');

        await expect(combobox).toBeHidden();
        await expect(changeButton.locator('..')).toContainText('Sykepleier');
        await expect.soft(changeButton, 'After the combobox unmounts, focus should return to Endre').toBeFocused();
        await scanPage(page, testInfo, 'job title changed');
    });

    test('viser tilgjengelig søkefeil og knytter feilen til stillingsfeltet', async ({ page }, testInfo) => {
        await page.route('**/api/stillingssok**', (route) =>
            route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Search unavailable' }) }),
        );
        await page.goto('/oppdater-opplysninger');
        const changeButton = page.getByRole('button', { name: 'Endre', exact: true });
        await expect(changeButton).toBeVisible();
        await tabTo(page, changeButton);
        await page.keyboard.press('Enter');

        const combobox = page.getByRole('combobox', { name: 'Søk etter stilling', exact: true });
        await expect(combobox).toBeVisible();
        await tabTo(page, combobox);
        const failure = page.waitForResponse((response) => response.url().includes('/api/stillingssok') && response.status() === 500);
        await combobox.fill('ukjent stilling');
        await failure;
        const error = page.getByText('Søket feilet. Prøv igjen senere.', { exact: true });
        await expect(error).toBeVisible();
        const association = await combobox.evaluate((element, message) => {
            const invalid = element.getAttribute('aria-invalid') === 'true';
            const ids = (element.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
            const describedError = ids
                .map((id) => document.getElementById(id))
                .find((described) => described?.textContent?.trim() === message);
            return {
                invalid,
                describesError: describedError !== undefined,
                errorVisible: Boolean(describedError && describedError.getClientRects().length > 0),
            };
        }, 'Søket feilet. Prøv igjen senere.');
        expect.soft(association.invalid, 'The combobox should expose its invalid state').toBe(true);
        expect.soft(association.describesError, 'aria-describedby should point to the visible search error').toBe(true);
        expect.soft(association.errorVisible, 'The associated search error should be visible').toBe(true);
        await scanPage(page, testInfo, 'job search error');
    });
});
