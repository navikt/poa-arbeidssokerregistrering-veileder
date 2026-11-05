// @vitest-environment jsdom

import { UNSAFE_Combobox } from '@navikt/ds-react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StillingsSok } from '@/components/skjema/StillingsSok';

vi.mock('@/lib/tracking', () => ({ loggAktivitet: vi.fn() }));

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe('StillingsSok', () => {
    it('gir Aksels eksisterende forslagsliste samme tilgjengelige navn som søkefeltet', async () => {
        render(<StillingsSok onClose={vi.fn()} />);
        const input = screen.getByRole('combobox', { name: 'Søk etter stilling' });
        fireEvent.keyDown(input, { key: 'ArrowDown' });

        expect(await screen.findByRole('listbox', { name: 'Søk etter stilling' })).toBeTruthy();
    });

    it.each([false, true])('lar en annen Aksel-combobox sin liste være urørt (andre først: %s)', async (andreForst) => {
        const stillingssok = <StillingsSok onClose={vi.fn()} />;
        const annetSok = <UNSAFE_Combobox label='Annet søk' options={['Kokk']} isListOpen />;
        render(
            <>
                {andreForst ? annetSok : stillingssok}
                {andreForst ? stillingssok : annetSok}
            </>,
        );
        const input = screen.getByRole('combobox', { name: 'Søk etter stilling' });
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        expect(await screen.findByRole('listbox', { name: 'Søk etter stilling' })).toBeTruthy();

        const annetInput = screen.getByRole('combobox', { name: 'Annet søk' });
        const id = annetInput.getAttribute('aria-controls');
        const annenPopup = document.getElementById(id as string);
        expect(annenPopup).not.toBeNull();
        expect(within(annenPopup as HTMLElement).queryByRole('listbox', { name: 'Søk etter stilling' })).toBeNull();
    });

    it('beholder tilgjengelig listenavn når søket feiler', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
        render(<StillingsSok onClose={vi.fn()} />);
        fireEvent.input(screen.getByRole('combobox', { name: 'Søk etter stilling' }), {
            target: { value: 'Sykepleier' },
        });

        expect(await screen.findByText('Søket feilet. Prøv igjen senere.')).toBeTruthy();
        expect(await screen.findByRole('listbox', { name: 'Søk etter stilling' })).toBeTruthy();
    });

    it('fokuserer Combobox-feltet når søket åpnes', () => {
        render(<StillingsSok onClose={vi.fn()} />);

        expect(document.activeElement).toBe(screen.getByRole('combobox', { name: 'Søk etter stilling' }));
    });

    it('sender valgt stilling til onClose fra Combobox-alternativet', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => [{ konseptId: 12345, label: 'Utvikler', styrk08: '2512' }],
            }),
        );
        const onClose = vi.fn();
        render(<StillingsSok onClose={onClose} />);

        fireEvent.input(screen.getByRole('combobox', { name: 'Søk etter stilling' }), {
            target: { value: 'Utvikler' },
        });
        fireEvent.pointerUp(await screen.findByRole('option', { name: 'Utvikler' }));

        expect(onClose).toHaveBeenCalledWith({ konseptId: 12345, label: 'Utvikler', styrk08: '2512' });
    });
});
