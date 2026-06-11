// @vitest-environment jsdom
import { expect, vi } from 'vitest';

vi.mock('@/lib/api/oversikten', () => ({
    getOversikten: vi.fn(),
}));

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { OversiktenApiResult } from '@/lib/api/oversikten';
import { daysSinceDate } from '@/lib/date-utils';
import oversiktenMock from '@/lib/mocks/oversikten.json';
import type { Arbeidssoker, OversiktApiResponse } from '@/model/oversikt-api';
import { Oversikten } from './Oversikten';

const typedMock = oversiktenMock as unknown as OversiktApiResponse;

const emptyOversikt: OversiktenApiResult = {
    arbeidssoekere: [],
};

const fullOversikt: OversiktenApiResult = {
    arbeidssoekere: typedMock.arbeidssoekere,
};

// Testdata der kun "lav"-kategorien (<150 dager) har brukere
const kunLaveBrukere: OversiktenApiResult = {
    arbeidssoekere: [
        {
            arbeidssoeker_id: 1,
            identitetsnummer: '12345678901',
            fornavn: 'TEST',
            etternavn: 'BRUKER',
            ledig_siden: '2026-05-12T00:00:00Z',
            periode: { id: 'per-1', startet: '2026-05-12T00:00:00Z' },
            bekreftelse_paa_vegne_av: [],
            tilknyttet_kontor: [],
        },
        {
            arbeidssoeker_id: 2,
            identitetsnummer: '12345678902',
            fornavn: 'ANDRE',
            etternavn: 'BRUKER',
            ledig_siden: '2026-03-03T00:00:00Z',
            periode: { id: 'per-2', startet: '2026-03-03T00:00:00Z' },
            bekreftelse_paa_vegne_av: [],
            tilknyttet_kontor: [],
        },
    ] as Arbeidssoker[],
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

    it('Rendrer heading med antall brukere og paginert tabell med 15 rader', async () => {
        await renderOversikten(fullOversikt);

        expect(screen.getByRole('heading', { level: 2 }).textContent).toContain('26 brukere');

        const rows = screen.getAllByRole('row');
        // 1 header-rad + 15 data-rader (paginert)
        expect(rows).toHaveLength(16);
    });

    it('Filtrering på kritisk (≥180 dager) viser kun riktige brukere', async () => {
        await renderOversikten(fullOversikt);

        const kritiskBrukere = typedMock.arbeidssoekere.filter((b) => daysSinceDate(b.ledig_siden) >= 180);
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
        const toDisplayName = (b: Arbeidssoker) =>
            `${b.fornavn.charAt(0).toUpperCase()}${b.fornavn.slice(1).toLowerCase()} ${b.etternavn.charAt(0).toUpperCase()}${b.etternavn.slice(1).toLowerCase()}`;
        for (const bruker of kritiskBrukere) {
            expect(screen.getByText(toDisplayName(bruker))).toBeDefined();
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
        // header + 11 rader (side 2 av 26 totalt med 15 per side = 11 rader)
        expect(rows).toHaveLength(12);
    });

    it('DagerTag viser riktig fargekode basert på antall dager', async () => {
        await renderOversikten(fullOversikt);

        // Brukere med ≥180 dager skal ha danger-tag
        const dangerTags = screen.getAllByText(/dager/).filter((el) => el.getAttribute('data-color') === 'danger');
        expect(dangerTags.length).toBeGreaterThan(0);

        // Verifiser at alle danger-tags har ≥180 dager
        for (const tag of dangerTags) {
            const days = parseInt(tag.textContent ?? '0', 10);
            expect(days).toBeGreaterThanOrEqual(180);
        }

        // Brukere med ≥150 og <180 dager skal ha warning-tag
        const warningDagerTags = screen
            .getAllByText(/dager/)
            .filter((el) => el.getAttribute('data-color') === 'warning');
        expect(warningDagerTags.length).toBeGreaterThan(0);
    });

    it('Filtrering med tom kategori viser kun header-rad i tabellen', async () => {
        await renderOversikten(kunLaveBrukere);

        // Kritisk og moderat skal vise (0) i chip-teksten
        expect(screen.getByRole('button', { name: /≥180 dager \(0\)/ })).toBeDefined();
        expect(screen.getByRole('button', { name: /150-179 dager \(0\)/ })).toBeDefined();

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
