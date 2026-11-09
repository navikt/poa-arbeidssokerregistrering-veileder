// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const pushMock = vi.fn();
const mockFnr = vi.fn(() => '12345678910');

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: pushMock }),
    useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('@/contexts/modia-context', () => ({
    useModiaContext: () => ({ fnr: mockFnr(), enhetId: '0219', setFnr: vi.fn(), setEnhetId: vi.fn() }),
}));

vi.mock('@/lib/tracking', () => ({ loggFlyt: vi.fn() }));
vi.mock('@/lib/api/inngang-opplysninger', () => ({ registrerOpplysninger: vi.fn() }));
vi.mock('@/lib/api/inngang-start-periode', () => ({ startPeriode: vi.fn() }));

import type { RegistreringState } from '@/model/registrering';
import { OpplysningerSkjema } from './OpplysningerSkjema';

function renderSkjema() {
    return render(<OpplysningerSkjema initState={{} as RegistreringState} mode='registrering' />);
}

function getInvalidInputs(container: HTMLElement) {
    return container.querySelectorAll<HTMLInputElement>('[aria-invalid="true"] input:not(:disabled)');
}

describe('OpplysningerSkjema universell utforming', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFnr.mockReturnValue('12345678910');
    });

    it('autofokuserer ikke ved visning og rendrer Avbryt som én lenke', () => {
        renderSkjema();

        expect(document.activeElement).not.toBeInstanceOf(HTMLInputElement);
        const avbryt = screen.getByRole('link', { name: 'Avbryt' });
        expect(avbryt.getAttribute('href')).toBe('/');
        expect(avbryt.querySelector('button')).toBeNull();
    });

    it('fokuserer første ugyldige felt ved hver mislykket innsending', async () => {
        const { container } = renderSkjema();

        fireEvent.click(screen.getByRole('button', { name: 'Registrer' }));

        await waitFor(() => {
            expect(getInvalidInputs(container).length).toBeGreaterThan(1);
            expect(document.activeElement).toBe(getInvalidInputs(container)[0]);
        });

        const invalidInputs = getInvalidInputs(container);
        const otherField = invalidInputs[invalidInputs.length - 1];
        expect(otherField).toBeDefined();
        otherField?.focus();
        expect(document.activeElement).toBe(otherField);

        fireEvent.click(screen.getByRole('button', { name: 'Registrer' }));

        await waitFor(() => {
            expect(document.activeElement).toBe(getInvalidInputs(container)[0]);
        });
    });

    it('lar fokus bli på feltet som brukeren endrer etter at feil er vist', async () => {
        const { container } = renderSkjema();

        fireEvent.click(screen.getByRole('button', { name: 'Registrer' }));

        await waitFor(() => {
            expect(getInvalidInputs(container).length).toBeGreaterThan(1);
        });

        const fieldToChange = getInvalidInputs(container)[1];
        expect(fieldToChange).toBeDefined();
        fieldToChange?.focus();
        fireEvent.click(fieldToChange as HTMLInputElement);

        expect(document.activeElement).toBe(fieldToChange);
    });
});
