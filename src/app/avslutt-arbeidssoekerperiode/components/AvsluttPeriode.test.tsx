// @vitest-environment jsdom

import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    fnr: '12345678910',
    push: vi.fn(),
    stoppPeriode: vi.fn(),
    loggAktivitet: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mocks.push }),
}));

vi.mock('@/contexts/modia-context', () => ({
    useModiaContext: () => ({ fnr: mocks.fnr }),
}));

vi.mock('@/lib/api/inngang-stopp-periode', () => ({
    stoppPeriode: (...args: unknown[]) => mocks.stoppPeriode(...args),
}));

vi.mock('@/lib/tracking', () => ({
    loggAktivitet: (...args: unknown[]) => mocks.loggAktivitet(...args),
}));

import { AvsluttPeriode } from './AvsluttPeriode';

describe('AvsluttPeriode', () => {
    beforeEach(() => {
        mocks.fnr = '12345678910';
        vi.clearAllMocks();
    });

    it('viser ikke handlingen når fnr mangler', () => {
        mocks.fnr = '';

        const { container } = render(<AvsluttPeriode />);

        expect(container.innerHTML).toBe('');
        expect(mocks.stoppPeriode).not.toHaveBeenCalled();
    });

    it('sender syntetisk fnr og navigerer etter vellykket avslutning', async () => {
        mocks.stoppPeriode.mockResolvedValue({ ok: true });

        render(<AvsluttPeriode />);
        fireEvent.click(screen.getByRole('button', { name: 'Avslutt arbeidssøkerperioden' }));

        await act(async () => {});

        expect(mocks.stoppPeriode).toHaveBeenCalledWith('12345678910');
        expect(mocks.push).toHaveBeenCalledWith('/arbeidssoekerperiode-er-avsluttet');
        expect(mocks.loggAktivitet).toHaveBeenCalledWith({ aktivitet: 'Avslutter arbeidssøkerperiode' });
    });

    it.each([
        ['returnert feil', async () => ({ ok: false, error: 'intern feil' })],
        ['avvist kall', async () => Promise.reject(new Error('intern feil'))],
    ])('viser generisk feilmelding uten navigasjon ved %s', async (_scenario, result) => {
        mocks.stoppPeriode.mockImplementation(result);

        render(<AvsluttPeriode />);
        fireEvent.click(screen.getByRole('button', { name: 'Avslutt arbeidssøkerperioden' }));

        expect(await screen.findByText('Noe gikk galt. Prøv igjen senere.')).toBeTruthy();
        expect(mocks.push).not.toHaveBeenCalled();
    });

    it('deaktiverer knappen og hindrer gjentatt kall mens avslutning pågår', async () => {
        let fullfoer!: (result: { ok: boolean }) => void;
        mocks.stoppPeriode.mockReturnValue(
            new Promise<{ ok: boolean }>((resolve) => {
                fullfoer = resolve;
            }),
        );

        render(<AvsluttPeriode />);
        const knapp = screen.getByRole('button', { name: 'Avslutt arbeidssøkerperioden' });
        fireEvent.click(knapp);

        expect((knapp as HTMLButtonElement).disabled).toBe(true);
        fireEvent.click(knapp);
        expect(mocks.stoppPeriode).toHaveBeenCalledTimes(1);

        await act(async () => {
            fullfoer({ ok: true });
        });
    });
});
