import type { Locator, Page } from '@playwright/test';
import { expect, tabTo } from './fixtures';

const SITUASJON = 'Velg den situasjonen som passer deg best';
const UTDANNING = 'Hva er din høyeste fullførte utdanning?';

function getRadioGroup(page: Page, name: string) {
    const accessibleName =
        name === 'Har du andre problemer med å søke eller være i jobb?'
            ? `${name} For eksempel språk, lesing og skriving eller familiesituasjon.`
            : name;
    return page.getByRole('radiogroup', { name: accessibleName, exact: true });
}

async function selectRadioByKeyboard(page: Page, group: Locator, label: string) {
    await expect(group, 'Expected one visible radio group before selecting an option').toHaveCount(1);
    await expect(group).toBeVisible();

    const target = group.getByRole('radio', { name: label, exact: true });
    await expect(target, `Expected one visible radio option named ${label}`).toHaveCount(1);
    await expect(target).toBeVisible();

    const radios = await group.getByRole('radio').all();
    if (radios.length === 0) {
        throw new Error(`Radio group did not contain options after becoming visible: ${label}`);
    }

    const targetId = await target.getAttribute('id');
    const targetValue = await target.getAttribute('value');
    if (!targetId && targetValue === null) {
        throw new Error(`Radio option has no stable id or value for keyboard selection: ${label}`);
    }

    let selectedIndex = -1;
    let wantedIndex = -1;
    for (const [index, radio] of radios.entries()) {
        const radioId = await radio.getAttribute('id');
        const radioValue = await radio.getAttribute('value');
        if ((targetId && radioId === targetId) || (!targetId && radioValue === targetValue)) wantedIndex = index;
        if (await radio.isChecked()) selectedIndex = index;
    }

    if (wantedIndex < 0) {
        throw new Error(`Radio option ${label} was not found in the visible group`);
    }

    if (selectedIndex < 0) {
        selectedIndex = 0;
        await tabTo(page, radios[selectedIndex]!);
        await page.keyboard.press('Space');
    } else {
        await tabTo(page, radios[selectedIndex]!);
    }

    while (selectedIndex < wantedIndex) {
        await page.keyboard.press('ArrowDown');
        selectedIndex += 1;
    }
    while (selectedIndex > wantedIndex) {
        await page.keyboard.press('ArrowUp');
        selectedIndex -= 1;
    }

    await expect(target).toBeChecked();
}

async function selectNamedRadio(page: Page, name: string, label: string) {
    await selectRadioByKeyboard(page, getRadioGroup(page, name), label);
}

async function selectLastJobStatus(page: Page) {
    const radio = page.getByRole('radio', { name: 'Har vært i jobb', exact: true });
    const group = page.getByRole('radiogroup').filter({ has: radio });
    await selectRadioByKeyboard(page, group, 'Har vært i jobb');
}

/** Kjøres i dokumentet som testes, også gjennom page.evaluate. */
function hasValidationFocus(): boolean {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || active === document.body || active === document.documentElement) return false;

    const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (
        firstInvalid &&
        (active === firstInvalid ||
            firstInvalid.contains(active) ||
            (active.matches('fieldset, [role="group"], [role="radiogroup"]') && active.contains(firstInvalid)))
    ) {
        return true;
    }

    // Aksel flytter fokus fra ErrorSummary til overskriften, som også har tabindex=-1.
    const summary = active.closest('.aksel-error-summary') ?? active;
    const nodes = [active, summary];
    const referencesError = nodes.some((node) =>
        (node.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean).some((id) =>
            document.getElementById(id)?.textContent?.includes('Du må svare'),
        ),
    );
    const links = Array.from(summary.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    if (active instanceof HTMLAnchorElement && active.hash) links.push(active);
    const linksToInvalidField = links.some((link) => {
        let id: string;
        try {
            id = decodeURIComponent(link.hash.slice(1));
        } catch {
            return false;
        }
        return Boolean(document.getElementById(id)?.closest('[aria-invalid="true"]'));
    });
    const isSummaryHeading = active.matches('h1, h2, h3, h4, h5, h6, [role="alert"]') || summary !== active;
    const label = `${summary.getAttribute('aria-label') ?? ''} ${summary.textContent ?? ''}`;
    return referencesError || linksToInvalidField || (isSummaryHeading && /feil|svar på spørsmålet/i.test(label));
}

/** Fyller alle registreringsfeltene gjennom radiogruppenes tastaturmønster. */
async function fillRegistration(page: Page) {
    await selectNamedRadio(page, SITUASJON, 'Er usikker på jobbsituasjonen min');
    await selectLastJobStatus(page);
    await selectNamedRadio(page, UTDANNING, 'Videregående, fagbrev eller svennebrev (3 år eller mer)');
    await selectNamedRadio(page, 'Er utdanningen din godkjent i Norge?', 'Ja');
    await selectNamedRadio(page, 'Er utdanningen din bestått?', 'Ja');
    await selectNamedRadio(page, 'Har du helseproblemer som hindrer deg i å søke eller være i jobb?', 'Ja');
    await selectNamedRadio(page, 'Har du andre problemer med å søke eller være i jobb?', 'Ja');
}

export { fillRegistration, getRadioGroup, hasValidationFocus, selectNamedRadio, selectRadioByKeyboard, selectLastJobStatus };
