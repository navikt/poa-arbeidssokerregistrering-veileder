// @vitest-environment jsdom

import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { KartleggingEnkeltperson } from './KartleggingEnkeltperson';

const snapshot: Snapshot = {
    id: 'test-snapshot',
    identitetsnummer: 'syntetisk-identifikator',
    startet: {
        sendtInnAv: {
            tidspunkt: '2026-02-01T10:00:00Z',
            utfoertAv: {
                type: 'VEILEDER',
                id: 'test-veileder',
            },
            kilde: 'test',
            aarsak: 'Testdata',
        },
        tidspunkt: '2026-02-01T10:00:00Z',
        type: 'PERIODE_STARTET_V1',
    },
};

const arbeidssoker: ArbeidssokerKompakt = {
    id: 1,
    aktorId: 'syntetisk-aktor',
    identitetsnummer: 'syntetisk-identifikator',
    fornavn: 'Test',
    etternavn: 'Arbeidssøker',
    ledighetsperioder: [
        {
            periodeStartet: '2026-01-01T00:00:00Z',
            ledigSiden: new Date(2026, 6, 1, 12).toISOString(),
            bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET', 'DAGPENGER'],
            egenvurdertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
            bekreftelseHarJobbet: false,
        },
    ],
    kontortilknytninger: [],
};

describe('KartleggingEnkeltperson', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('viser registreringsinformasjon når personen ikke finnes i kartleggingen', () => {
        render(<KartleggingEnkeltperson arbeidssoker={null} snapshot={snapshot} />);

        const title = screen.getByRole('heading', { level: 2, name: 'Personen er registrert som arbeidssøker' });
        expect(title).toBeDefined();
        expect(screen.getByText(/Registrert.*av veileder/)).toBeDefined();
        expect(title.textContent).not.toContain('Registrert');
        expect(screen.queryByText('Dager helt ledig')).toBeNull();
    });

    it('viser data fra arbeidssøkerens aktive periode', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 6, 21, 12));

        render(<KartleggingEnkeltperson arbeidssoker={arbeidssoker} snapshot={snapshot} />);

        expect(screen.getByText('Dager helt ledig')).toBeDefined();
        expect(screen.getByText('20 dager')).toBeDefined();
        expect(screen.getByText('Bekreftelser kommer fra')).toBeDefined();
        expect(screen.getByText('Arbeidssøkerregisteret')).toBeDefined();
        expect(screen.getByText('Dagpenger')).toBeDefined();
        expect(screen.getAllByText('Nei')).toHaveLength(1);
        expect(screen.getAllByText('Ja')).toHaveLength(1);

        const responsiveWrappers = document.querySelectorAll('.grid-cols-1');
        expect(responsiveWrappers).toHaveLength(4);
        for (const wrapper of responsiveWrappers) {
            expect(wrapper.classList.contains('ax-md:grid-cols-[minmax(0,1fr)_210px]')).toBe(true);
        }
    });

    it('viser fallback når arbeidssøkeren ikke har en aktiv periode', () => {
        render(
            <KartleggingEnkeltperson arbeidssoker={{ ...arbeidssoker, ledighetsperioder: [] }} snapshot={snapshot} />,
        );

        expect(screen.getByText('Mangler egenvurdering')).toBeDefined();
        expect(screen.getByText('MANGLER DATA')).toBeDefined();
    });
});
