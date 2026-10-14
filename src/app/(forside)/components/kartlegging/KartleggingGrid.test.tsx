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

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { ITEMS_PER_PAGE } from './constants';
import { Kartlegging } from './KartleggingGrid';

function createArbeidssoker(id: number, daysAgo: number): ArbeidssokerKompakt {
    const ledigSiden = new Date();
    ledigSiden.setDate(ledigSiden.getDate() - daysAgo);
    ledigSiden.setHours(12, 0, 0, 0);

    return {
        id,
        aktorId: `aktor-${id}`,
        identitetsnummer: `ident-${id}`,
        fornavn: `TEST${id}`,
        etternavn: 'BRUKER',
        ledighetsperioder: [
            {
                periodeStartet: ledigSiden.toISOString(),
                ledigSiden: ledigSiden.toISOString(),
                bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET'],
            },
        ],
        kontortilknytninger: [],
    };
}

async function renderKartlegging(result: KartleggingApiKompaktResult) {
    await act(async () => {
        render(<Kartlegging kartleggingPromise={Promise.resolve(result)} />);
    });
}

describe('KartleggingGrid', () => {
    beforeEach(() => {
        mockSetFnr.mockClear();
        vi.stubEnv('TZ', 'UTC');
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-01-15T12:00:00.000Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllEnvs();
    });

    it('viser dager som vanlig tekst og markerer cellefarge ved terskelverdiene', async () => {
        const thresholds = [
            { days: 149, status: undefined },
            { days: 150, status: 'warning' },
            { days: 179, status: 'warning' },
            { days: 180, status: 'danger' },
        ] as const;

        await renderKartlegging({
            arbeidssoekere: thresholds.map(({ days }, index) => createArbeidssoker(index + 1, days)),
        });

        for (const { days, status } of thresholds) {
            const dayText = screen.getByText(`${days} dager`);
            const dayCell = dayText.closest('td');

            expect(dayCell).not.toBeNull();
            expect(dayCell?.contains(dayText)).toBe(true);
            expect(dayText.tagName).toBe('SPAN');
            expect(Array.from(dayText.attributes, ({ name }) => name)).toEqual(status ? ['data-color-status'] : []);
            expect(dayText.getAttribute('data-color-status')).toBe(status ?? null);
        }
    });

    it('sorterer alle brukerne før paginering og nullstiller siden ved sortering', async () => {
        const arbeidssoekere = Array.from({ length: ITEMS_PER_PAGE + 1 }, (_, index) =>
            createArbeidssoker(index + 1, index + 1),
        );
        await renderKartlegging({ arbeidssoekere });

        expect(screen.getByRole('table', { name: 'Arbeidssøkere' })).toBeDefined();
        expect(screen.getAllByRole('row')[1]?.textContent).toContain('Test101 Bruker');

        const side2 = within(screen.getByRole('navigation')).getByRole('button', { name: /2/ });
        await act(async () => fireEvent.click(side2));
        expect(screen.getByRole('button', { name: 'Test1 Bruker' })).toBeDefined();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: /dager ledig/i })));

        expect(screen.getAllByRole('row')).toHaveLength(ITEMS_PER_PAGE + 1);
        expect(screen.getByRole('button', { name: 'Test1 Bruker' })).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Test101 Bruker' })).toBeNull();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: /dager ledig/i })));
        expect(screen.getAllByRole('row')[1]?.textContent).toContain('Test101 Bruker');
    });

    it('filtrerer på valgt ledighetskategori', async () => {
        await renderKartlegging({
            arbeidssoekere: [createArbeidssoker(1, 210), createArbeidssoker(2, 160), createArbeidssoker(3, 30)],
        });

        await act(async () => fireEvent.click(screen.getByRole('button', { name: '≥180 dager (1)' })));

        expect(screen.getByRole('button', { name: 'Test1 Bruker' })).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Test2 Bruker' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Test3 Bruker' })).toBeNull();
    });

    it('viser resterende bruker på side 2 og åpner valgt person ved navneklikk', async () => {
        await renderKartlegging({
            arbeidssoekere: Array.from({ length: ITEMS_PER_PAGE + 1 }, (_, index) =>
                createArbeidssoker(index + 1, index + 1),
            ),
        });

        await act(async () =>
            fireEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: /2/ })),
        );
        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Test1 Bruker' })));

        expect(screen.getAllByRole('row')).toHaveLength(2);
        expect(mockSetFnr).toHaveBeenCalledOnce();
        expect(mockSetFnr).toHaveBeenCalledWith('ident-1');
    });

    it('viser tom tilstand når det ikke finnes tilgjengelige data', async () => {
        await renderKartlegging({ arbeidssoekere: [] });

        expect(screen.getByText('Ingen tilgjengelig data')).toBeDefined();
    });
});
