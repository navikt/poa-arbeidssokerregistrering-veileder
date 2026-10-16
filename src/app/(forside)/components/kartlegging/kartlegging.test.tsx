// @vitest-environment jsdom
import { expect, vi } from 'vitest';

vi.mock('@/lib/api/kartlegging', () => ({
    getKartlegging: vi.fn(),
}));

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ModiaProvider } from '@/contexts/modia-context';
import type { KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import kartleggingKompaktMock from '@/lib/mocks/kartlegging-kompakt.json';
import type { ArbeidssokerKompakt, KartleggingApiKompaktResponse } from '@/model/kartlegging-api';
import { ITEMS_PER_PAGE } from './constants';
import { Kartlegging } from './Kartlegging';

const typedMock = kartleggingKompaktMock as unknown as KartleggingApiKompaktResponse;

const emptyKartlegging: KartleggingApiKompaktResult = {
    arbeidssoekere: [],
};

const fullKartlegging: KartleggingApiKompaktResult = {
    arbeidssoekere: typedMock.arbeidssoekere,
};

function daysAgoIso(days: number): string {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - days);
    d.setUTCHours(12, 0, 0, 0);
    return d.toISOString();
}

// Testdata der kun "lav"-kategorien (<150 dager) har brukere
const kunLaveBrukere: KartleggingApiKompaktResult = {
    arbeidssoekere: [
        {
            id: 1,
            aktorId: '123',
            identitetsnummer: '12345678901',
            fornavn: 'TEST',
            etternavn: 'BRUKER',
            ledighetsperioder: [
                {
                    periodeStartet: daysAgoIso(30),
                    ledigSiden: daysAgoIso(30),
                    bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET'],
                },
            ],
            kontortilknytninger: [],
        },
        {
            id: 2,
            aktorId: '456',
            identitetsnummer: '12345678902',
            fornavn: 'ANDRE',
            etternavn: 'BRUKER',
            ledighetsperioder: [
                {
                    periodeStartet: daysAgoIso(60),
                    ledigSiden: daysAgoIso(60),
                    bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET'],
                },
            ],
            kontortilknytninger: [],
        },
    ] as ArbeidssokerKompakt[],
};

function createArbeidssoker(id: number, daysAgo: number): ArbeidssokerKompakt {
    return {
        id,
        aktorId: `${10000000000 + id}`,
        identitetsnummer: `${10000000000 + id}`,
        fornavn: `TEST${id}`,
        etternavn: 'BRUKER',
        ledighetsperioder: [
            {
                periodeStartet: daysAgoIso(daysAgo),
                ledigSiden: daysAgoIso(daysAgo),
                bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET'],
            },
        ],
        kontortilknytninger: [],
    };
}

function createStorKartlegging(totalArbeidssokere = ITEMS_PER_PAGE + 1): KartleggingApiKompaktResult {
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

function createFilterKartlegging(): KartleggingApiKompaktResult {
    return {
        arbeidssoekere: [
            createArbeidssoker(1, 210),
            createArbeidssoker(2, 180),
            createArbeidssoker(3, 179),
            createArbeidssoker(4, 150),
            createArbeidssoker(5, 149),
            createArbeidssoker(6, 45),
        ],
    };
}

function createDagerTagKartlegging(): KartleggingApiKompaktResult {
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

async function renderKartlegging(kartleggingResult: KartleggingApiKompaktResult) {
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
        vi.stubEnv('TZ', 'UTC');
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));
    });

    afterAll(() => {
        vi.useRealTimers();
        vi.unstubAllEnvs();
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
        await renderKartlegging(createFilterKartlegging());

        const kritiskChip = screen.getByRole('button', { name: '≥180 dager (2)' });

        await act(async () => {
            fireEvent.click(kritiskChip);
        });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3);
        expect(screen.getByText('Test1 Bruker')).toBeDefined();
        expect(screen.getByText('Test2 Bruker')).toBeDefined();
        expect(screen.queryByText('Test3 Bruker')).toBeNull();
        expect(screen.queryByText('Test4 Bruker')).toBeNull();
        expect(screen.queryByText('Test5 Bruker')).toBeNull();
        expect(screen.queryByText('Test6 Bruker')).toBeNull();
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
        expect(screen.getAllByRole('row')[1]?.textContent).toContain('Test20 Bruker');

        const paginering = screen.getByRole('navigation');
        const side2Knapp = within(paginering).getByRole('button', { name: /2/ });
        await act(async () => {
            fireEvent.click(side2Knapp);
        });
        expect(screen.getAllByRole('row')).toHaveLength(2);

        const sortHeader = screen.getByRole('button', { name: /dager ledig/i });
        await act(async () => {
            fireEvent.click(sortHeader);
        });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(Math.min(storKartlegging.arbeidssoekere.length, ITEMS_PER_PAGE) + 1);
        expect(rows[1]?.textContent).toContain('Test31 Bruker');
        expect(screen.queryByText('Test20 Bruker')).toBeNull();
    });

    it('Filtrering nullstiller paginering til første side', async () => {
        const storKartlegging = createStorKartlegging();
        await renderKartlegging(storKartlegging);

        const paginering = screen.getByRole('navigation');
        const side2Knapp = within(paginering).getByRole('button', { name: /2/ });
        await act(async () => {
            fireEvent.click(side2Knapp);
        });

        const kritiskChip = screen.getByRole('button', { name: '≥180 dager (20)' });
        await act(async () => {
            fireEvent.click(kritiskChip);
        });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(21);
        expect(rows[1]?.textContent).toContain('Test20 Bruker');
        expect(screen.getByText('Test1 Bruker')).toBeDefined();
        expect(screen.queryByText('Test21 Bruker')).toBeNull();
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
