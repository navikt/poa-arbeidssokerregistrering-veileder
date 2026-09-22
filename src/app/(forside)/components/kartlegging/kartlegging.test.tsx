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
import { ITEMS_PER_PAGE } from './constants';
import { Kartlegging } from './Kartlegging';

const typedMock = kartleggingMock as unknown as KartleggingApiResponse;

const emptyKartlegging: KartleggingApiResult = {
    arbeidssoekere: [],
};

const fullKartlegging: KartleggingApiResult = {
    arbeidssoekere: typedMock.arbeidssoekere,
};

function daysAgoIso(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
}

// Testdata der kun "lav"-kategorien (<150 dager) har brukere
const kunLaveBrukere: KartleggingApiResult = {
    arbeidssoekere: [
        {
            id: 1,
            identitetsnummer: '12345678901',
            fornavn: 'TEST',
            etternavn: 'BRUKER',
            ledighetsperioder: [
                {
                    periode: { id: 'per-1', startet: daysAgoIso(30) },
                    ledigSiden: daysAgoIso(30),
                    bekreftelsePaaVegneAv: [],
                },
            ],
            kontortilknytninger: [],
        },
        {
            id: 2,
            identitetsnummer: '12345678902',
            fornavn: 'ANDRE',
            etternavn: 'BRUKER',
            ledighetsperioder: [
                {
                    periode: { id: 'per-2', startet: daysAgoIso(60) },
                    ledigSiden: daysAgoIso(60),
                    bekreftelsePaaVegneAv: [],
                },
            ],
            kontortilknytninger: [],
        },
    ] as Arbeidssoker[],
};

function createArbeidssoker(id: number, daysAgo: number): Arbeidssoker {
    return {
        id,
        identitetsnummer: `${10000000000 + id}`,
        fornavn: `TEST${id}`,
        etternavn: 'BRUKER',
        ledighetsperioder: [
            {
                periode: { id: `per-${id}`, startet: daysAgoIso(daysAgo) },
                ledigSiden: daysAgoIso(daysAgo),
                bekreftelsePaaVegneAv: [],
            },
        ],
        kontortilknytninger: [],
    };
}

function createStorKartlegging(totalArbeidssokere = ITEMS_PER_PAGE + 1): KartleggingApiResult {
    return {
        arbeidssoekere: Array.from({ length: totalArbeidssokere }, (_, index) => {
            if (index < 20) {
                return createArbeidssoker(index + 1, 200 + index);
            }

            if (index < 30) {
                return createArbeidssoker(index + 1, 20 + index - 20);
            }

            return createArbeidssoker(index + 1, 5 + index - 30);
        }),
    };
}

function createFilterKartlegging(): KartleggingApiResult {
    return {
        arbeidssoekere: [
            createArbeidssoker(1, 210),
            createArbeidssoker(2, 190),
            createArbeidssoker(3, 170),
            createArbeidssoker(4, 155),
            createArbeidssoker(5, 120),
            createArbeidssoker(6, 45),
        ],
    };
}

function createDagerTagKartlegging(): KartleggingApiResult {
    return {
        arbeidssoekere: [
            createArbeidssoker(1, 220),
            createArbeidssoker(2, 165),
            createArbeidssoker(3, 40),
            ...Array.from({ length: Math.max(ITEMS_PER_PAGE - 3, 0) }, (_, index) =>
                createArbeidssoker(index + 4, 10 + index),
            ),
        ],
    };
}

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
    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-01T00:00:00Z'));
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it('Har tilgang, men ingen resultater', async () => {
        await renderKartlegging(emptyKartlegging);
        expect(screen.getByText('Ingen tilgjengelig data')).toBeDefined();
    });

    it('Rendrer heading med antall brukere og riktig antall rader', async () => {
        await renderKartlegging(fullKartlegging);

        expect(screen.getByRole('heading', { level: 2, name: /Arbeidssøkere/ }).textContent).toContain(
            `${fullKartlegging.arbeidssoekere.length} brukere`,
        );

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(Math.min(fullKartlegging.arbeidssoekere.length, ITEMS_PER_PAGE) + 1);
    });

    it('Filtrering på kritisk (≥180 dager) viser kun riktige brukere', async () => {
        const kartlegging = createFilterKartlegging();
        await renderKartlegging(kartlegging);

        const kritiskBrukere = kartlegging.arbeidssoekere.filter(
            (b) => daysSinceDate(b.ledighetsperioder[0]?.ledigSiden) >= 180,
        );
        const kritiskChip = screen.getByRole('button', {
            name: new RegExp(`≥180 dager \\(${kritiskBrukere.length}\\)`),
        });

        await act(async () => {
            fireEvent.click(kritiskChip);
        });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(kritiskBrukere.length + 1);

        const toDisplayName = (b: Arbeidssoker) =>
            `${b.fornavn.charAt(0).toUpperCase()}${b.fornavn.slice(1).toLowerCase()} ${b.etternavn.charAt(0).toUpperCase()}${b.etternavn.slice(1).toLowerCase()}`;
        for (const bruker of kritiskBrukere) {
            expect(screen.getByText(toDisplayName(bruker))).toBeDefined();
        }
    });

    it('Paginering viser side 2 med resterende brukere', async () => {
        const storKartlegging = createStorKartlegging();
        await renderKartlegging(storKartlegging);

        // Finn paginering-nav og klikk side 2
        const paginering = screen.getByRole('navigation');
        const side2Knapp = within(paginering).getByRole('button', { name: /2/ });
        await act(async () => {
            fireEvent.click(side2Knapp);
        });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(storKartlegging.arbeidssoekere.length - ITEMS_PER_PAGE + 1);
    });

    it('Sortering nullstiller paginering til første side', async () => {
        const storKartlegging = createStorKartlegging();
        await renderKartlegging(storKartlegging);

        const paginering = screen.getByRole('navigation');
        const side2Knapp = within(paginering).getByRole('button', { name: /2/ });
        await act(async () => {
            fireEvent.click(side2Knapp);
        });

        const sortHeader = screen.getByRole('button', { name: /dager ledig/i });
        await act(async () => {
            fireEvent.click(sortHeader);
        });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(Math.min(storKartlegging.arbeidssoekere.length, ITEMS_PER_PAGE) + 1);
    });

    it('Filtrering nullstiller paginering til første side', async () => {
        const storKartlegging = createStorKartlegging();
        await renderKartlegging(storKartlegging);

        const paginering = screen.getByRole('navigation');
        const side2Knapp = within(paginering).getByRole('button', { name: /2/ });
        await act(async () => {
            fireEvent.click(side2Knapp);
        });

        const kritiskBrukere = storKartlegging.arbeidssoekere.filter(
            (b) => daysSinceDate(b.ledighetsperioder[0]?.ledigSiden) >= 180,
        );
        const kritiskChip = screen.getByRole('button', {
            name: new RegExp(`≥180 dager \\(${kritiskBrukere.length}\\)`),
        });
        await act(async () => {
            fireEvent.click(kritiskChip);
        });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(Math.min(kritiskBrukere.length, ITEMS_PER_PAGE) + 1);
    });

    it('DagerTag viser riktig fargekode basert på antall dager', async () => {
        await renderKartlegging(createDagerTagKartlegging());

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
