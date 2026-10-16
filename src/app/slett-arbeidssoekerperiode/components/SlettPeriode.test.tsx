// @vitest-environment jsdom

import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    fnr: '12345678910',
    push: vi.fn(),
    slettPeriode: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mocks.push }),
}));

vi.mock('@/contexts/modia-context', () => ({
    useModiaContext: () => ({ fnr: mocks.fnr }),
}));

vi.mock('@/lib/api/inngang-slett-periode', () => ({
    slettPeriode: (...args: unknown[]) => mocks.slettPeriode(...args),
}));

import { SlettPeriode } from './SlettPeriode';

describe('SlettPeriode', () => {
    beforeEach(() => {
        mocks.fnr = '12345678910';
        vi.clearAllMocks();
    });

    it('viser ikke handlingen når fnr mangler', () => {
        mocks.fnr = '';

        const { container } = render(<SlettPeriode />);

        expect(container.innerHTML).toBe('');
        expect(mocks.slettPeriode).not.toHaveBeenCalled();
    });

    it('krever bekreftelse før sletting og navigerer etter vellykket sletting', async () => {
        mocks.slettPeriode.mockResolvedValue({ ok: true });

        render(<SlettPeriode />);
        const knapp = screen.getByRole('button', { name: 'Slett arbeidssøkerperioden' });

        expect((knapp as HTMLButtonElement).disabled).toBe(true);
        expect(mocks.slettPeriode).not.toHaveBeenCalled();

        fireEvent.click(
            screen.getByRole('checkbox', {
                name: 'Jeg bekrefter at arbeidssøkerperioden skal slettes på grunn av feilregistrering',
            }),
        );
        expect((knapp as HTMLButtonElement).disabled).toBe(false);

        fireEvent.click(knapp);
        await act(async () => {});

        expect(mocks.slettPeriode).toHaveBeenCalledWith('12345678910');
        expect(mocks.push).toHaveBeenCalledWith('/arbeidssoekerperiode-er-slettet');
    });

    it.each([
        ['returnert feil', async () => ({ ok: false, error: 'intern feil' })],
        ['avvist kall', async () => Promise.reject(new Error('intern feil'))],
    ])('viser generisk feilmelding uten navigasjon ved %s', async (_scenario, result) => {
        mocks.slettPeriode.mockImplementation(result);

        render(<SlettPeriode />);
        fireEvent.click(
            screen.getByRole('checkbox', {
                name: 'Jeg bekrefter at arbeidssøkerperioden skal slettes på grunn av feilregistrering',
            }),
        );
        fireEvent.click(screen.getByRole('button', { name: 'Slett arbeidssøkerperioden' }));

        expect(await screen.findByText('Noe gikk galt. Prøv igjen senere.')).toBeTruthy();
        expect(mocks.push).not.toHaveBeenCalled();
    });

    it('deaktiverer knappen og hindrer gjentatt kall mens sletting pågår', async () => {
        let fullfoer!: (result: { ok: boolean }) => void;
        mocks.slettPeriode.mockReturnValue(
            new Promise<{ ok: boolean }>((resolve) => {
                fullfoer = resolve;
            }),
        );

        render(<SlettPeriode />);
        fireEvent.click(
            screen.getByRole('checkbox', {
                name: 'Jeg bekrefter at arbeidssøkerperioden skal slettes på grunn av feilregistrering',
            }),
        );
        const knapp = screen.getByRole('button', { name: 'Slett arbeidssøkerperioden' });
        fireEvent.click(knapp);

        expect((knapp as HTMLButtonElement).disabled).toBe(true);
        fireEvent.click(knapp);
        expect(mocks.slettPeriode).toHaveBeenCalledTimes(1);

        await act(async () => {
            fullfoer({ ok: true });
        });
    });
});
