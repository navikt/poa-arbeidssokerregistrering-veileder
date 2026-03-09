// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

// ———————————————————————————————————————————————————
// Mocks — must be declared before imports
// ———————————————————————————————————————————————————

vi.mock('@/lib/tracking', () => ({
    loggAktivitet: vi.fn(),
    loggFlyt: vi.fn(),
    loggVisning: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('@/app/contexts/modia-context', () => ({
    useModiaContext: () => ({
        fnr: '12345678910',
        enhetId: '0219',
        setFnr: vi.fn(),
        setEnhetId: vi.fn(),
    }),
}));

// Mock server actions that use 'use server' / next/headers
vi.mock('@/lib/api/inngang-opplysninger', () => ({
    registrerOpplysninger: vi.fn(),
}));

vi.mock('@/lib/api/inngang-start-periode', () => ({
    startPeriode: vi.fn(),
}));

// ———————————————————————————————————————————————————
// Imports (after mocks)
// ———————————————————————————————————————————————————

import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import type { SisteArbeidsforholdResult } from '@/lib/api/aareg';
import type { SnapshotResult } from '@/lib/api/oppslag-snapshot';

import { RegistrerArbeidssoeker } from './RegistrerArbeidssoeker';

// ———————————————————————————————————————————————————
// Test data
// ———————————————————————————————————————————————————

const AVSLUTTET_TIDSPUNKT = '2026-02-10T06:20:12.727Z';

const snapshotMedAvsluttet: Snapshot = {
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
    opplysning: {
        id: '3404cf4f-2458-424c-9854-7be9a5dbc14a',
        utdanning: { nus: '3', bestaatt: 'JA', godkjent: 'JA' },
        helse: { helsetilstandHindrerArbeid: 'NEI' },
        jobbsituasjon: {
            beskrivelser: [
                {
                    beskrivelse: 'HAR_BLITT_SAGT_OPP',
                    detaljer: { stilling: 'Annen stilling', stilling_styrk08: '00' },
                },
            ],
        },
        annet: { andreForholdHindrerArbeid: 'NEI' },
        tidspunkt: '2026-02-10T06:17:49.667Z',
        type: 'OPPLYSNINGER_V4',
    },
} as unknown as Snapshot;

const snapshotUtenAvsluttet: Snapshot = {
    id: 'a43abadd-5f86-41e0-9b69-31d091861252',
    identitetsnummer: '24849098329',
    startet: {
        tidspunkt: '2026-02-11T09:40:09.652Z',
        type: 'PERIODE_STARTET_V1',
    },
    opplysning: {
        jobbsituasjon: {
            beskrivelser: [
                {
                    beskrivelse: 'USIKKER_JOBBSITUASJON',
                    detaljer: {
                        stilling: 'WEBUTVIKLER',
                        stilling_styrk08: '2130',
                    },
                },
            ],
        },
    },
} as unknown as Snapshot;

const aaregResult: SisteArbeidsforholdResult = {
    sisteArbeidsforhold: {
        konseptId: 12345,
        label: 'KONTORLEDER',
        styrk08: '1231',
    },
};

const emptyAaregResult: SisteArbeidsforholdResult = {
    sisteArbeidsforhold: null,
};

// ———————————————————————————————————————————————————
// Helpers
// ———————————————————————————————————————————————————

async function renderRegistrerArbeidssoeker(
    snapshotResult: SnapshotResult,
    sisteArbeidsforholdResult: SisteArbeidsforholdResult = emptyAaregResult,
) {
    await act(async () => {
        render(
            <Suspense fallback={<div>Laster…</div>}>
                <RegistrerArbeidssoeker
                    snapshotPromise={Promise.resolve(snapshotResult)}
                    sisteArbeidsforholdPromise={Promise.resolve(sisteArbeidsforholdResult)}
                />
            </Suspense>,
        );
    });
}

// ———————————————————————————————————————————————————
// Tests
// ———————————————————————————————————————————————————

describe('RegistrerArbeidssoeker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ———————————————————————————————————————————————
    // Snapshot error
    // ———————————————————————————————————————————————

    describe('feil ved henting av snapshot', () => {
        it('viser feilmelding når snapshot har error', async () => {
            await renderRegistrerArbeidssoeker({
                snapshot: null,
                error: new Error('Noe gikk galt'),
            });

            expect(screen.getByText('Noe gikk dessverre galt. Prøv igjen senere')).toBeDefined();
        });

        it('viser IKKE OpplysningerSkjema ved snapshot-feil', async () => {
            await renderRegistrerArbeidssoeker({
                snapshot: null,
                error: new Error('Noe gikk galt'),
            });

            expect(screen.queryByRole('button', { name: 'Registrer' })).toBeNull();
        });
    });

    // ———————————————————————————————————————————————
    // Ingen tidligere perioder - snapshot er null
    // ———————————————————————————————————————————————

    describe('ingen tidligere periode (snapshot er null)', () => {
        it('viser IKKE TilbyOpplysningerFraGammelPeriode', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: null });

            expect(
                screen.queryByRole('button', { name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode' }),
            ).toBeNull();
        });

        it('viser OpplysningerSkjema med Registrer-knapp', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: null });

            expect(screen.getByRole('button', { name: 'Registrer' })).toBeDefined();
        });

        it('viser Annen stilling som standard når ingen data finnes', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: null });

            expect(screen.getAllByText('Annen stilling')).toBeDefined();
        });
    });

    // ———————————————————————————————————————————————
    // Pågående periode (ikke avsluttet) — ingen "hent"
    // ———————————————————————————————————————————————

    describe('pågående periode (ikke avsluttet)', () => {
        it('viser IKKE TilbyOpplysningerFraGammelPeriode', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotUtenAvsluttet });

            expect(
                screen.queryByRole('button', { name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode' }),
            ).toBeNull();
        });

        it('viser OpplysningerSkjema', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotUtenAvsluttet });

            expect(screen.getByRole('button', { name: 'Registrer' })).toBeDefined();
        });
    });

    // ———————————————————————————————————————————————
    // Avsluttet periode — "hent" er tilgjengelig
    // ———————————————————————————————————————————————

    describe('avsluttet periode — tilbyr prefill', () => {
        it('viser TilbyOpplysningerFraGammelPeriode med avslutningsdato', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotMedAvsluttet }, aaregResult);

            const expectedDatePart = new Intl.DateTimeFormat('nb').format(new Date(AVSLUTTET_TIDSPUNKT));
            expect(
                screen.getByText((content) => content.includes('avsluttet') && content.includes(expectedDatePart)),
            ).toBeDefined();
        });

        it('viser "Fyll inn opplysninger"-knappen', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotMedAvsluttet }, aaregResult);

            expect(
                screen.getByRole('button', { name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode' }),
            ).toBeDefined();
        });

        it('viser OpplysningerSkjema samtidig', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotMedAvsluttet }, aaregResult);

            expect(screen.getByRole('button', { name: 'Registrer' })).toBeDefined();
        });
    });

    // ———————————————————————————————————————————————
    // Prefill flyt — klikk trigger mapOpplysninger
    // ———————————————————————————————————————————————

    describe('prefill-flyt ved klikk på "Fyll inn opplysninger"', () => {
        it('viser siste jobb fra aareg etter klikk når aareg har data', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotMedAvsluttet }, aaregResult);

            const button = screen.getByRole('button', {
                name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode',
            });

            await act(async () => {
                fireEvent.click(button);
            });

            // aaregResult har KONTORLEDER — buildSisteJobb prioriterer aa-reg
            expect(screen.getByText('KONTORLEDER')).toBeDefined();
        });

        it('faller tilbake til snapshot-stilling etter klikk når aareg mangler data', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotMedAvsluttet }, emptyAaregResult);

            const button = screen.getByRole('button', {
                name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode',
            });

            await act(async () => {
                fireEvent.click(button);
            });

            // emptyAaregResult → faller tilbake til snapshot-stilling «Annen stilling» (fra snapshotMedAvsluttet)
            expect(screen.getAllByText('Annen stilling')).toBeDefined();
        });

        it('beholder OpplysningerSkjema synlig etter klikk (re-rendres med ny key)', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotMedAvsluttet }, aaregResult);

            const button = screen.getByRole('button', {
                name: 'Fyll inn opplysninger fra siste arbeidssøkerperiode',
            });

            await act(async () => {
                fireEvent.click(button);
            });

            // OpplysningerSkjema should still be visible after prefill
            expect(screen.getByRole('button', { name: 'Registrer' })).toBeDefined();
        });
    });

    describe('Siste stilling', () => {
        it('viser Annen stilling når aa-reg mangler data og snapshot er avsluttet (clean slate)', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotMedAvsluttet }, emptyAaregResult);
            expect(screen.getAllByText('Annen stilling')).toBeDefined();
        });

        it('viser data fra snapshot når aa-reg mangler data og snapshot ikke er avsluttet', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotUtenAvsluttet }, emptyAaregResult);
            expect(screen.getAllByText('WEBUTVIKLER')).toBeDefined();
        });

        it('viser stilling fra aa-reg når aa-reg har data og snapshot har data', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: snapshotUtenAvsluttet }, aaregResult);
            expect(screen.getByText('KONTORLEDER')).toBeDefined();
        });

        it('viser stilling fra aa-reg selv uten snapshot', async () => {
            await renderRegistrerArbeidssoeker({ snapshot: null }, aaregResult);
            expect(screen.getByText('KONTORLEDER')).toBeDefined();
        });
    });
});
