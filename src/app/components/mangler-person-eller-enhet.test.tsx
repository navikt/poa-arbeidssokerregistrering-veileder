// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ManglerPersonEllerEnhet } from '@/app/components/ManglerPersonEllerEnhet';
import { ModiaProvider } from '@/app/contexts/modia-context';

function renderMedModia(fnr: string | null, enhetId: string | null) {
    return render(
        <ModiaProvider initFnr={fnr} initEnhetId={enhetId}>
            <ManglerPersonEllerEnhet />
        </ModiaProvider>,
    );
}

describe('ManglerPersonEllerEnhet', () => {
    it('rendrer ingenting når både fnr og enhetId er satt', () => {
        const { container } = renderMedModia('12345678910', '0219');
        expect(container.innerHTML).toBe('');
    });

    it('viser advarsel når fnr er null', () => {
        renderMedModia(null, '0219');
        expect(screen.getByText('Fødselsnummer mangler')).toBeDefined();
        expect(screen.getByText('Du må søke opp en person for å kunne registrere vedkommende')).toBeDefined();
    });

    it('viser advarsel når fnr er tom streng', () => {
        renderMedModia('', '0219');
        expect(screen.getByText('Fødselsnummer mangler')).toBeDefined();
    });

    it('viser advarsel når enhetId mangler', () => {
        renderMedModia('12345678910', '');
        expect(screen.getByText('Enhet mangler')).toBeDefined();
        expect(screen.getByText('Du må velge aktiv enhet.')).toBeDefined();
    });
});
