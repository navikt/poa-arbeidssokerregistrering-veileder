import type { Locator, Page } from '@playwright/test';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { matcherEvents, playwrightExpect } = vi.hoisted(() => {
    const matcherEvents: string[] = [];
    const makeExpect = (actual: unknown) => {
        const locator = actual as {
            description?: string;
            count?: () => Promise<number>;
            isVisible?: () => Promise<boolean>;
            isChecked?: () => Promise<boolean>;
        };
        return {
            toHaveCount: async (expected: number) => {
                matcherEvents.push(`count:${locator.description ?? 'value'}`);
                const count = locator.count ? await locator.count() : Number(actual);
                if (count !== expected) throw new Error(`expected count ${expected}, found ${count}`);
            },
            toBeVisible: async () => {
                matcherEvents.push(`visible:${locator.description ?? 'value'}`);
                if (!locator.isVisible || !(await locator.isVisible())) throw new Error('expected locator to be visible');
            },
            toBeChecked: async () => {
                if (!locator.isChecked || !(await locator.isChecked())) throw new Error('expected radio to be checked');
            },
            toBeGreaterThanOrEqual: (expected: number) => {
                if (Number(actual) < expected) throw new Error(`expected ${String(actual)} to be at least ${expected}`);
            },
        };
    };
    const playwrightExpect = Object.assign(makeExpect, { soft: makeExpect });
    return { matcherEvents, playwrightExpect };
});

vi.mock('@playwright/test', () => ({
    expect: playwrightExpect,
    test: { extend: () => ({}) },
}));

import { getRadioGroup, hasValidationFocus, selectRadioByKeyboard } from './forms';
import { tabTo } from './fixtures';

type FakeLocator = Locator & {
    description: string;
    count: () => Promise<number>;
    isVisible: () => Promise<boolean>;
    evaluate: <T>(callback: (element: Element) => T) => Promise<T>;
    getAttribute: (name: string) => Promise<string | null>;
    isChecked: () => Promise<boolean>;
    getByRole?: (role: string, options?: { name?: string; exact?: boolean }) => FakeLocator;
    all?: () => Promise<FakeLocator[]>;
};

function makeElementLocator(element: HTMLElement, description: string): FakeLocator {
    return {
        description,
        count: async () => 1,
        isVisible: async () => true,
        evaluate: async (callback) => callback(element),
        getAttribute: async (name) => element.getAttribute(name),
        isChecked: async () => element instanceof HTMLInputElement && element.checked,
    } as FakeLocator;
}

function makeRadioGroup(labels: string[], selectedIndex = -1) {
    const root = document.createElement('fieldset');
    root.setAttribute('role', 'radiogroup');
    const inputs = labels.map((label, index) => {
        const optionLabel = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'test-radio-group';
        input.id = `radio-${index}`;
        input.value = `value-${index}`;
        input.checked = index === selectedIndex;
        optionLabel.append(input, document.createTextNode(label));
        root.append(optionLabel);
        return input;
    });
    document.body.append(root);

    const radioLocators = inputs.map((input, index) => makeElementLocator(input, `radio-${index}`));
    const group = makeElementLocator(root, 'group') as FakeLocator;
    group.getByRole = (role, options) => {
        if (role !== 'radio') throw new Error(`Unexpected role ${role}`);
        if (!options?.name) {
            const collection = makeElementLocator(root, 'radio-options') as FakeLocator;
            collection.all = async () => {
                matcherEvents.push('all:radio-options');
                return radioLocators;
            };
            return collection;
        }
        const index = labels.findIndex((label) => label === options.name);
        return index >= 0
            ? radioLocators[index]!
            : ({
                  ...makeElementLocator(root, `missing-radio-${options.name}`),
                  count: async () => 0,
                  isVisible: async () => false,
                  isChecked: async () => false,
              } as FakeLocator);
    };
    return { group, inputs };
}

function makePage(inputs: HTMLElement[] = [], focusTarget?: HTMLElement) {
    const keyboardPress = vi.fn(async (key: string) => {
        const activeIndex = inputs.indexOf(document.activeElement as HTMLElement);
        if (key === 'Tab') {
            const nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % inputs.length;
            inputs[nextIndex]?.focus();
            if (inputs.length === 0) focusTarget?.focus();
        } else if (key === 'Space') {
            const active = document.activeElement;
            if (active instanceof HTMLInputElement && active.type === 'radio') active.checked = true;
        } else if (key === 'ArrowDown' || key === 'ArrowUp') {
            const step = key === 'ArrowDown' ? 1 : -1;
            const nextIndex = Math.max(0, Math.min(inputs.length - 1, activeIndex + step));
            inputs.forEach((input, index) => {
                if (input instanceof HTMLInputElement && input.type === 'radio') input.checked = index === nextIndex;
            });
            inputs[nextIndex]?.focus();
        }
    });
    return { keyboard: { press: keyboardPress } as unknown as Page['keyboard'], keyboardPress } as unknown as Page & {
        keyboardPress: typeof keyboardPress;
    };
}

describe('UU tastaturhjelpere', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        matcherEvents.length = 0;
    });

    it('lar fokus være i fred når målet allerede er aktivt', async () => {
        const target = document.createElement('button');
        document.body.append(target);
        const page = makePage([], target);
        target.focus();

        await tabTo(page, makeElementLocator(target, 'active-target'));

        expect(page.keyboardPress).not.toHaveBeenCalled();
    });

    it('går med Tab til målet innenfor grensen', async () => {
        const first = document.createElement('button');
        const second = document.createElement('button');
        const target = document.createElement('button');
        document.body.append(first, second, target);
        let tabCount = 0;
        const page = makePage([], target);
        page.keyboardPress.mockImplementation(async (key: string) => {
            if (key === 'Tab') {
                tabCount += 1;
                if (tabCount === 3) target.focus();
            }
        });

        await tabTo(page, makeElementLocator(target, 'target'));

        expect(tabCount).toBe(3);
    });

    it('feiler tydelig når tastaturnavigering ikke når målet', async () => {
        const target = document.createElement('button');
        document.body.append(target);
        const page = makePage();

        await expect(tabTo(page, makeElementLocator(target, 'unreachable'))).rejects.toThrow(
            'Keyboard Tab did not reach the requested target within 100 key presses',
        );
        expect(page.keyboardPress).toHaveBeenCalledTimes(100);
    });

    it('feiler før tastaturnavigering når målet ikke lenger finnes', async () => {
        const target = {
            ...makeElementLocator(document.createElement('button'), 'removed-target'),
            count: async () => 0,
        } as FakeLocator;
        const page = makePage();

        await expect(tabTo(page, target)).rejects.toThrow('Keyboard Tab target must match exactly one element; found 0');
        expect(page.keyboardPress).not.toHaveBeenCalled();
    });

    it('bruker det fullstendige tilgjengelige navnet for spørsmålet om andre problemer', () => {
        const group = makeElementLocator(document.createElement('fieldset'), 'mapped-group');
        const page = {
            getByRole: vi.fn(() => group),
        } as unknown as Page;

        expect(getRadioGroup(page, 'Har du andre problemer med å søke eller være i jobb?')).toBe(group);
        expect(page.getByRole).toHaveBeenCalledWith('radiogroup', {
            name: 'Har du andre problemer med å søke eller være i jobb? For eksempel språk, lesing og skriving eller familiesituasjon.',
            exact: true,
        });
    });

    it('venter på den navngitte gruppen og radioen før det henter alternativer og velger med piltast', async () => {
        const { group, inputs } = makeRadioGroup(['Ja', 'Nei']);
        const page = makePage(inputs);

        await selectRadioByKeyboard(page, group, 'Nei');

        const enumerationIndex = matcherEvents.indexOf('all:radio-options');
        expect(enumerationIndex).toBeGreaterThan(0);
        expect(matcherEvents.slice(0, enumerationIndex)).toEqual([
            'count:group',
            'visible:group',
            'count:radio-1',
            'visible:radio-1',
        ]);
        expect(inputs[1]?.checked).toBe(true);
        expect(page.keyboardPress).toHaveBeenCalledWith('ArrowDown');
    });

    it('feiler på manglende radio før tomme alternativer kan skjule feilen', async () => {
        const { group } = makeRadioGroup(['Ja', 'Nei']);

        await expect(selectRadioByKeyboard(makePage(), group, 'Vet ikke')).rejects.toThrow('expected count 1, found 0');
        expect(matcherEvents).not.toContain('all:radio-options');
    });

    it('velger bakover med piltast fra et forhåndsvalgt alternativ', async () => {
        const { group, inputs } = makeRadioGroup(['Ja', 'Nei'], 1);
        const page = makePage(inputs);
        inputs[1]?.focus();

        await selectRadioByKeyboard(page, group, 'Ja');

        expect(inputs[0]?.checked).toBe(true);
        expect(page.keyboardPress).toHaveBeenCalledWith('ArrowUp');
        expect(page.keyboardPress).not.toHaveBeenCalledWith('Tab');
    });

    it('godtar programmatisk fokus på Aksel-feiloverskrift med tabindex=-1', () => {
        document.body.innerHTML = '<div class="aksel-error-summary" tabindex="-1"><h2 tabindex="-1">Du må rette disse feilene</h2><a href="#svar">Gå til spørsmålet</a></div><fieldset aria-invalid="true"><input id="svar"></fieldset>';
        document.querySelector<HTMLElement>('h2')?.focus();

        expect(hasValidationFocus()).toBe(true);
    });

    it('godtar en fokusert feillenke til et felt i en ugyldig gruppe', () => {
        document.body.innerHTML = '<a href="#svar">Du må svare</a><fieldset aria-invalid="true"><input id="svar"></fieldset>';
        document.querySelector<HTMLElement>('a')?.focus();

        expect(hasValidationFocus()).toBe(true);
    });

    it('godtar fokus på første ugyldige felt, men ikke et senere ugyldig felt', () => {
        document.body.innerHTML = '<input id="first" aria-invalid="true"><input id="second" aria-invalid="true">';
        document.querySelector<HTMLElement>('#first')?.focus();
        expect(hasValidationFocus()).toBe(true);
        document.querySelector<HTMLElement>('#second')?.focus();
        expect(hasValidationFocus()).toBe(false);
    });

    it('godtar ikke body eller innsendingsknappen som valideringsfokus', () => {
        document.body.innerHTML = '<input aria-invalid="true"><button>Registrer</button>';
        expect(hasValidationFocus()).toBe(false);
        document.querySelector<HTMLElement>('button')?.focus();
        expect(hasValidationFocus()).toBe(false);
    });
});
