// @vitest-environment jsdom
import { expect, vi } from 'vitest';

vi.mock('@/lib/api/kartlegging', () => ({
    getKartlegging: vi.fn(),
}));

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ModiaProvider } from '@/contexts/modia-context';
import type { KartleggingApiResult } from '@/lib/api/kartlegging';
import { daysSinceDate } from '@/lib/date-utils';
import kartleggingMock from '@/lib/mocks/kartlegging.json';
import type { Arbeidssoker, KartleggingApiResponse } from '@/model/kartlegging-api';
import { Kartlegging } from './Kartlegging';

const typedMock = kartleggingMock as unknown as KartleggingApiResponse;

const emptyKartlegging: KartleggingApiResult = {
    arbeidssoekere: [],
};

const fullKartlegging: KartleggingApiResult = {
    arbeidssoekere: typedMock.arbeidssoekere,
};

// Testdata der kun "lav"-kategorien (<150 dager) har brukere
const kunLaveBrukere: KartleggingApiResult = {
    arbeidssoekere: [
        {
            arbeidssoekerId: 1,
            identitetsnummer: '12345678901',
            fornavn: 'TEST',
            etternavn: 'BRUKER',
            ledighetsperioder: [
                {
                    periode: { id: 'per-1', startet: '2026-05-12T00:00:00Z' },
                    ledigSiden: '2026-05-12T00:00:00Z',
                    bekreftelsePaaVegneAv: [],
                },
            ],
            kontortilknytninger: [],
        },
        {
            arbeidssoekerId: 2,
            identitetsnummer: '12345678902',
            fornavn: 'ANDRE',
            etternavn: 'BRUKER',
            ledighetsperioder: [
                {
                    periode: { id: 'per-2', startet: '2026-03-03T00:00:00Z' },
                    ledigSiden: '2026-03-03T00:00:00Z',
                    bekreftelsePaaVegneAv: [],
                },
            ],
            kontortilknytninger: [],
        },
    ] as Arbeidssoker[],
};

async function renderKartlegging(kartleggingResult: KartleggingApiResult) {
    await act(async () => {
        render(
            <ModiaProvider initFnr={null} initEnhetId='4154'>
                <Kartlegging kartleggingPromise={Promise.resolve(kartleggingResult)} />
            </ModiaProvider>,
        );
    });
}

describe('Kartlegging', () => {
    it('Har tilgang, men ingen resultater', async () => {
        await renderKartlegging(emptyKartlegging);
        expect(screen.getByText('Ingen tilgjengelig data')).toBeDefined();
    });

    it('Rendrer heading med antall brukere og paginert tabell med 15 rader', async () => {
        await renderKartlegging(fullKartlegging);

        expect(screen.getByRole('heading', { level: 2, name: /Arbeidssøkere/ }).textContent).toContain('26 brukere');

        const rows = screen.getAllByRole('row');
        // 1 header-rad + 15 data-rader (paginert)
        expect(rows).toHaveLength(16);
    });

    it('Filtrering på kritisk (≥180 dager) viser kun riktige brukere', async () => {
        await renderKartlegging(fullKartlegging);

        const kritiskBrukere = typedMock.arbeidssoekere.filter(
            (b) => daysSinceDate(b.ledighetsperioder[0]?.ledigSiden) >= 180,
        );
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
        await renderKartlegging(fullKartlegging);

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
        await renderKartlegging(fullKartlegging);

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
        await renderKartlegging(kunLaveBrukere);

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
