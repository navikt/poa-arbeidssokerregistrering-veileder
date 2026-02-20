// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { FilterProvider } from '@/app/contexts/filter-hendelse-context';
import { VisningsTypeProvider } from '@/app/contexts/hendelse-visning-context';
import { samplePeriode } from './__mocks__/tidslinje-mock-data';
import { HistorikkPeriode } from './HistorikkPeriode';

function renderWithProviders(ui: React.ReactElement) {
    return render(
        <FilterProvider>
            <VisningsTypeProvider>{ui}</VisningsTypeProvider>
        </FilterProvider>,
    );
}

beforeEach(() => {
    localStorage.clear();
});

describe('HistorikkPeriode', () => {
    it('rendrer en article per hendelse i perioden', () => {
        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        const articles = screen.getAllByRole('article');
        expect(articles).toHaveLength(samplePeriode.hendelser.length);
    });

    it('viser riktig tittel for opplysninger-hendelse', () => {
        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        expect(screen.getByText('Opplysninger sendt')).toBeDefined();
    });

    it('viser riktig tittel for profilering-hendelse', () => {
        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        expect(screen.getByText('Profilering: Oppgitt hindringer')).toBeDefined();
    });

    it('viser riktig tittel for periode startet-hendelse', () => {
        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        expect(screen.getByText('Periode startet')).toBeDefined();
    });

    it('viser riktig tittel for på vegne av stoppet-hendelse', () => {
        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        expect(screen.getByText('På vegne av stoppet')).toBeDefined();
    });

    it('rendrer opplysninger-detaljer for OPPLYSNINGER_V4', () => {
        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        expect(screen.getByText('Se innsendte opplysninger')).toBeDefined();
    });

    it('rendrer profilering-detaljer for PROFILERING_V1', () => {
        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        expect(screen.getByText('Se profilering')).toBeDefined();
    });

    it('viser kilde-tag for hver hendelse', () => {
        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        const kildeTags = screen.getAllByText(/Kilde:/);
        expect(kildeTags).toHaveLength(samplePeriode.hendelser.length);
    });

    it('filtrerer bort hendelser som ikke er i filteret', async () => {
        localStorage.setItem('historikk-hendelse-filter', JSON.stringify(['OPPLYSNINGER_V4']));

        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        await waitFor(() => {
            const articles = screen.getAllByRole('article');
            expect(articles).toHaveLength(1);
        });
    });

    it('viser ingen hendelser når filteret er tomt', async () => {
        localStorage.setItem('historikk-hendelse-filter', JSON.stringify([]));

        renderWithProviders(<HistorikkPeriode periode={samplePeriode} />);

        await waitFor(() => {
            expect(screen.queryAllByRole('article')).toHaveLength(0);
        });
    });
});
