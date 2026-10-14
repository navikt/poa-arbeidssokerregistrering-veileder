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
            ledigSiden: new Date(2026, 0, 1, 12).toISOString(),
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

        expect(screen.getByText('Personen er registrert som arbeidssøker')).toBeDefined();
        expect(screen.getByText(/Registrert.*av veileder/)).toBeDefined();
        expect(screen.queryByText('Dager helt ledig')).toBeNull();
    });

    it('viser data fra arbeidssøkerens aktive periode', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 5, 1, 12));

        render(<KartleggingEnkeltperson arbeidssoker={arbeidssoker} snapshot={snapshot} />);

        expect(screen.getByText('Dager helt ledig')).toBeDefined();
        expect(screen.getByText('150 dager')).toBeDefined();
        expect(screen.getByText('Bekreftelser kommer fra')).toBeDefined();
        expect(screen.getByText('Arbeidssøkerregisteret')).toBeDefined();
        expect(screen.getByText('Dagpenger')).toBeDefined();
        expect(screen.getAllByText('Nei')).toHaveLength(2);
    });

    it('viser fallback når arbeidssøkeren ikke har en aktiv periode', () => {
        render(
            <KartleggingEnkeltperson arbeidssoker={{ ...arbeidssoker, ledighetsperioder: [] }} snapshot={snapshot} />,
        );

        expect(screen.getByText('IKKE SVART')).toBeDefined();
        expect(screen.getByText('MANGLER DATA')).toBeDefined();
    });
});
