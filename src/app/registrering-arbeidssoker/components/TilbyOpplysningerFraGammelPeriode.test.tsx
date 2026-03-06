// @vitest-environment jsdom

import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

// ———————————————————————————————————————————————————
// Mocks — must be declared before imports
// ———————————————————————————————————————————————————

const mockLoggAktivitet = vi.fn();

vi.mock('@/lib/tracking', () => ({
    loggAktivitet: (...args: unknown[]) => mockLoggAktivitet(...args),
    loggFlyt: vi.fn(),
    loggVisning: vi.fn(),
}));

// ———————————————————————————————————————————————————
// Imports (after mocks)
// ———————————————————————————————————————————————————

import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { fireEvent, render, screen } from '@testing-library/react';
import { TilbyOpplysningerFraGammelPeriode } from './TilbyOpplysningerFraGammelPeriode';

// ———————————————————————————————————————————————————
// Test data
// ———————————————————————————————————————————————————

const AVSLUTTET_TIDSPUNKT = '2026-02-10T06:20:12.727Z';

const snapshotMedAvsluttet = {
    id: '927f6ce5-452d-4734-ac96-e4528878fc51',
    identitetsnummer: '21488117839',
    startet: {
        tidspunkt: '2026-02-10T06:17:49.060Z',
        type: 'PERIODE_STARTET_V1',
    },
    avsluttet: {
        tidspunkt: AVSLUTTET_TIDSPUNKT,
        type: 'PERIODE_AVSLUTTET_V1',
    },
} as unknown as Snapshot;

const snapshotUtenAvsluttet = {
    id: 'a43abadd-5f86-41e0-9b69-31d091861252',
    identitetsnummer: '24849098329',
    startet: {
        tidspunkt: '2026-02-11T09:40:09.652Z',
        type: 'PERIODE_STARTET_V1',
    },
} as unknown as Snapshot;

// ———————————————————————————————————————————————————
// Tests
// ———————————————————————————————————————————————————

describe('TilbyOpplysningerFraGammelPeriode', () => {
    let onBrukSistPeriodeMock: Mock<() => void>;

    beforeEach(() => {
        vi.clearAllMocks();
        onBrukSistPeriodeMock = vi.fn<() => void>();
    });

    // ———————————————————————————————————————————————
    // Conditional rendering
    // ———————————————————————————————————————————————

    describe('rendrer ingenting når det ikke finnes en avsluttet periode', () => {
        it('rendrer ingenting når snapshot er null', () => {
            const { container } = render(
                <TilbyOpplysningerFraGammelPeriode snapshot={null} onBrukSistPeriode={onBrukSistPeriodeMock} />,
            );
            expect(container.innerHTML).toBe('');
        });

        it('rendrer ingenting når snapshot ikke har avsluttet-felt (pågående periode)', () => {
            const { container } = render(
                <TilbyOpplysningerFraGammelPeriode
                    snapshot={snapshotUtenAvsluttet}
                    onBrukSistPeriode={onBrukSistPeriodeMock}
                />,
            );
            expect(container.innerHTML).toBe('');
        });
    });

    // ———————————————————————————————————————————————
    // Rendering with avsluttet periode
    // ———————————————————————————————————————————————

    describe('rendrer info-alert når snapshot har avsluttet periode', () => {
        it('viser tekst med formatert avslutningsdato', () => {
            render(
                <TilbyOpplysningerFraGammelPeriode
                    snapshot={snapshotMedAvsluttet}
                    onBrukSistPeriode={onBrukSistPeriodeMock}
                />,
            );

            const expectedDatePart = new Intl.DateTimeFormat('nb').format(new Date(AVSLUTTET_TIDSPUNKT));
            expect(
                screen.getByText((content) => content.includes('avsluttet') && content.includes(expectedDatePart)),
            ).toBeDefined();
        });

        it('viser "Fyll inn opplysninger fra siste arbeidssøkerperiode"-knappen', () => {
            render(
                <TilbyOpplysningerFraGammelPeriode
                    snapshot={snapshotMedAvsluttet}
                    onBrukSistPeriode={onBrukSistPeriodeMock}
                />,
            );

            expect(
                screen.getByRole('button', { name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode' }),
            ).toBeDefined();
        });
    });

    // ———————————————————————————————————————————————
    // Button click behavior
    // ———————————————————————————————————————————————

    describe('knappeklikk', () => {
        it('kaller onBrukSistPeriode ved klikk', () => {
            render(
                <TilbyOpplysningerFraGammelPeriode
                    snapshot={snapshotMedAvsluttet}
                    onBrukSistPeriode={onBrukSistPeriodeMock}
                />,
            );

            const button = screen.getByRole('button', {
                name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode',
            });
            fireEvent.click(button);

            expect(onBrukSistPeriodeMock).toHaveBeenCalledTimes(1);
        });

        it('logger aktivitet med riktig melding ved klikk', () => {
            render(
                <TilbyOpplysningerFraGammelPeriode
                    snapshot={snapshotMedAvsluttet}
                    onBrukSistPeriode={onBrukSistPeriodeMock}
                />,
            );

            const button = screen.getByRole('button', {
                name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode',
            });
            fireEvent.click(button);

            expect(mockLoggAktivitet).toHaveBeenCalledWith({
                aktivitet: 'Klikker på "Fyll inn opplysninger fra siste arbeidssøkerperiode"',
            });
        });

        it('kaller både onBrukSistPeriode og loggAktivitet ved ett klikk', () => {
            render(
                <TilbyOpplysningerFraGammelPeriode
                    snapshot={snapshotMedAvsluttet}
                    onBrukSistPeriode={onBrukSistPeriodeMock}
                />,
            );

            const button = screen.getByRole('button', {
                name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode',
            });
            fireEvent.click(button);

            expect(onBrukSistPeriodeMock).toHaveBeenCalledTimes(1);
            expect(mockLoggAktivitet).toHaveBeenCalledTimes(1);
        });
    });
});
