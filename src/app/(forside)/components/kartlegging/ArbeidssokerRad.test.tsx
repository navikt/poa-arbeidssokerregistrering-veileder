// @vitest-environment jsdom
import { vi } from 'vitest';

const mockSetFnr = vi.fn();

vi.mock('@/contexts/modia-context', () => ({
    useModiaContext: () => ({
        fnr: null,
        enhetId: '4154',
        setFnr: mockSetFnr,
        setEnhetId: vi.fn(),
    }),
}));

import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { ArbeidssokerRad } from './ArbeidssokerRad';

const baseArbeidssoker: ArbeidssokerKompakt = {
    id: 1,
    aktorId: '123',
    identitetsnummer: '12345678901',
    fornavn: 'OLA',
    etternavn: 'NORDMANN',
    ledighetsperioder: [
        {
            periodeStartet: '2026-01-01T00:00:00Z',
            ledigSiden: '2026-01-01T00:00:00Z',
            bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET'],
        },
    ],
    kontortilknytninger: [],
};

async function renderRad(arbeidssoker: ArbeidssokerKompakt) {
    await act(async () => {
        render(
            <table>
                <tbody>
                    <ArbeidssokerRad arbeidssoker={arbeidssoker} />
                </tbody>
            </table>,
        );
    });
}

describe('ArbeidssokerRad', () => {
    beforeEach(() => {
        mockSetFnr.mockClear();
    });

    it('kaller setFnr med identitetsnummer ved klikk på navn', async () => {
        await renderRad(baseArbeidssoker);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /ola nordmann/i }));
        });

        expect(mockSetFnr).toHaveBeenCalledOnce();
        expect(mockSetFnr).toHaveBeenCalledWith('12345678901');
    });

    it('kaller ikke setFnr når identitetsnummer mangler', async () => {
        const utenIdent = { ...baseArbeidssoker, identitetsnummer: undefined } as unknown as ArbeidssokerKompakt;
        await renderRad(utenIdent);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /ola nordmann/i }));
        });

        expect(mockSetFnr).not.toHaveBeenCalled();
    });
});
