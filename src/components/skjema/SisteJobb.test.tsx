// @vitest-environment jsdom

import { DinSituasjon, SisteStillingValg, SporsmalId } from '@navikt/arbeidssokerregisteret-utils';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SisteJobb } from '@/components/skjema/SisteJobb';
import type { RegistreringState } from '@/model/registrering';

vi.mock('@/lib/tracking', () => ({ loggAktivitet: vi.fn() }));

const stillingsforslag = [{ konseptId: 12345, label: 'Utvikler', styrk08: ['2512', '2513'] }];

function registrering(): RegistreringState {
    return {
        [SporsmalId.dinSituasjon]: DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
        [SporsmalId.sisteStilling]: SisteStillingValg.INGEN_SVAR,
        [SporsmalId.sisteJobb]: { konseptId: 234, label: 'Kokk', styrk08: '5120' },
    };
}

function stubStillingssok() {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: async () => stillingsforslag,
        }),
    );
}

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe('SisteJobb', () => {
    it('bruker riktig overskriftsnivå og grupperer jobbvalgene med en meningsfull legend', () => {
        render(<SisteJobb registrering={registrering()} setRegistrering={vi.fn()} doValidate={false} />);

        expect(screen.getByRole('heading', { level: 2, name: 'Hva er din siste jobb?' })).toBeTruthy();
        expect(screen.getByRole('heading', { level: 3, name: 'Stilling' })).toBeTruthy();
        expect(screen.getByRole('radiogroup', { name: 'Har du vært i jobb?' })).toBeTruthy();
    });

    it('viser svarfeil når sisteStilling fortsatt har verdien INGEN_SVAR', () => {
        render(<SisteJobb registrering={registrering()} setRegistrering={vi.fn()} doValidate />);

        const group = screen.getByRole('radiogroup', { name: 'Har du vært i jobb?' });
        const radio = screen.getByRole('radio', { name: 'Har vært i jobb' });
        const error = screen.getByText('Du må svare på spørsmålet før du kan registrere arbeidssøkeren.');
        const describedBy = radio.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
        const description = describedBy[0] ? document.getElementById(describedBy[0]) : null;

        expect(group.getAttribute('aria-invalid')).toBe('true');
        expect(description?.textContent).toContain(error.textContent);
    });

    it('fokuserer søkefeltet når redigering åpnes', () => {
        render(<SisteJobb registrering={registrering()} setRegistrering={vi.fn()} doValidate={false} />);

        fireEvent.click(screen.getByRole('button', { name: 'Endre' }));

        expect(document.activeElement).toBe(screen.getByRole('combobox', { name: 'Søk etter stilling' }));
    });

    it('setter valgt stilling, normaliserer styrk08 og gir fokus tilbake til Endre', async () => {
        stubStillingssok();
        const setRegistrering = vi.fn<(data: Partial<RegistreringState>) => void>();
        render(<SisteJobb registrering={registrering()} setRegistrering={setRegistrering} doValidate={false} />);

        fireEvent.click(screen.getByRole('button', { name: 'Endre' }));
        const input = screen.getByRole('combobox', { name: 'Søk etter stilling' });
        fireEvent.input(input, { target: { value: 'Utvikler' } });
        fireEvent.pointerUp(await screen.findByRole('option', { name: 'Utvikler' }));

        const endreButton = screen.getByRole('button', { name: 'Endre' });
        await waitFor(() => expect(document.activeElement).toBe(endreButton));
        expect(setRegistrering).toHaveBeenCalledWith({
            [SporsmalId.sisteJobb]: { konseptId: 12345, label: 'Utvikler', styrk08: '2512' },
        });
    });

    it('beholder naturlig fokus utenfor søket når feltet mister fokus', async () => {
        render(
            <>
                <SisteJobb registrering={registrering()} setRegistrering={vi.fn()} doValidate={false} />
                <button type='button'>Utenfor søket</button>
            </>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Endre' }));
        const outsideButton = screen.getByRole('button', { name: 'Utenfor søket' });
        outsideButton.focus();

        await waitFor(() => expect(screen.queryByRole('combobox', { name: 'Søk etter stilling' })).toBeNull());
        expect(document.activeElement).toBe(outsideButton);
        expect(document.activeElement).not.toBe(screen.getByRole('button', { name: 'Endre' }));
    });
});
