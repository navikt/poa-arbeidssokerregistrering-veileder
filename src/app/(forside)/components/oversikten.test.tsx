// @vitest-environment jsdom
import { expect, vi } from 'vitest';

vi.mock('@/lib/api/oversikten', () => ({
    getOversikten: vi.fn(),
}));

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { OversiktenApiResult, OversiktType } from '@/lib/api/oversikten';
import oversiktenMock from '@/lib/mocks/oversikten.json';
import { Oversikten } from './Oversikten';

const emptyOversikt: OversiktenApiResult = {
    oversikt: null,
};

const fullOversikt: OversiktenApiResult = {
    oversikt: oversiktenMock as OversiktType[],
};

// Testdata der kun "lav"-kategorien (<150 dager) har brukere
const kunLaveBrukere: OversiktenApiResult = {
    oversikt: [
        {
            id: 1,
            navn: 'Test Bruker',
            dagerLedig: 30,
            bekreftelsesloesning: 'DAGPENGER',
            onskerVeileder: { svar: true, dato: '2026-05-01' },
            rapportertArbeid: { svar: false, dato: '2026-05-10' },
        },
        {
            id: 2,
            navn: 'Andre Bruker',
            dagerLedig: 100,
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            onskerVeileder: { svar: false, dato: '2026-04-15' },
            rapportertArbeid: { svar: true, dato: '2026-05-12' },
        },
    ],
};

async function renderOversikten(oversiktenResult: OversiktenApiResult) {
    await act(async () => {
        render(<Oversikten oversiktenPromise={Promise.resolve(oversiktenResult)} />);
    });
}

describe('Oversikten', () => {
    it('Har tilgang, men ingen resultater', async () => {
        await renderOversikten(emptyOversikt);
        expect(screen.getByText('Ingen tilgjengelig data')).toBeDefined();
    });

    it('Rendrer heading med antall brukere og paginert tabell med 10 rader', async () => {
        await renderOversikten(fullOversikt);

        expect(screen.getByRole('heading', { level: 2 }).textContent).toContain('26 brukere');

        const rows = screen.getAllByRole('row');
        // 1 header-rad + 10 data-rader (paginert)
        expect(rows).toHaveLength(11);
    });

    it('Filtrering på kritisk (≥180 dager) viser kun riktige brukere', async () => {
        await renderOversikten(fullOversikt);

        const kritiskBrukere = oversiktenMock.filter((b) => b.dagerLedig >= 180);
        const kritiskChip = screen.getByRole('button', {
            name: new RegExp(`≥180 dager \\(${kritiskBrukere.length}\\)`),
        });

        await act(async () => {
            fireEvent.click(kritiskChip);
        });

        const rows = screen.getAllByRole('row');
        // header + filtrerte rader
        expect(rows).toHaveLength(kritiskBrukere.length + 1);

        // Verifiser at alle viste brukere har ≥180 dager
        for (const bruker of kritiskBrukere) {
            expect(screen.getByText(bruker.navn)).toBeDefined();
        }
    });

    it('Paginering viser side 2 med resterende brukere', async () => {
        await renderOversikten(fullOversikt);

        // Finn paginering-nav og klikk side 2
        const paginering = screen.getByRole('navigation');
        const side2Knapp = within(paginering).getByRole('button', { name: /2/ });
        await act(async () => {
            fireEvent.click(side2Knapp);
        });

        const rows = screen.getAllByRole('row');
        // header + 10 rader (side 2 av 26 totalt = 10 rader)
        expect(rows).toHaveLength(11);
    });

    it('DagerTag viser riktig fargekode basert på antall dager', async () => {
        await renderOversikten(fullOversikt);

        // Brukere med ≥180 dager skal ha danger-tag
        const dangerTags = screen.getAllByText(/dager/).filter((el) => el.getAttribute('data-color') === 'danger');
        expect(dangerTags.length).toBeGreaterThan(0);

        // Brukere med ≥150 og <180 dager skal ha warning-tag
        const warningDagerTags = screen
            .getAllByText(/dager/)
            .filter((el) => el.getAttribute('data-color') === 'warning');
        expect(warningDagerTags.length).toBeGreaterThan(0);

        // Sjekk at en spesifikk bruker med 182 dager har danger-tag
        const dangerTag = screen.getByText('182 dager');
        expect(dangerTag.getAttribute('data-color')).toBe('danger');
    });

    it('Filtrering med tom kategori viser kun header-rad i tabellen', async () => {
        await renderOversikten(kunLaveBrukere);

        // Kritisk og moderat skal vise (0) i chip-teksten
        expect(screen.getByRole('button', { name: /≥180 dager \(0\)/ })).toBeDefined();
        expect(screen.getByRole('button', { name: /180-150 dager \(0\)/ })).toBeDefined();

        // Klikk på kritisk-filter (som har 0 brukere)
        const kritiskChip = screen.getByRole('button', { name: /≥180 dager \(0\)/ });
        await act(async () => {
            fireEvent.click(kritiskChip);
        });

        // Tabellen skal kun ha header-raden
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(1);
    });
});
