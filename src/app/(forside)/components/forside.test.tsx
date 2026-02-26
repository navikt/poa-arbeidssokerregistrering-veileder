// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Mocker for moduler som har avhengigheter til server-side kode (next/headers, etc.)
 * eller browser-globaler (window.umami).
 * Disse MÅ stå før imports av komponentene vi tester.
 */
vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('@/lib/tracking', () => ({
    loggAktivitet: vi.fn(),
    loggFlyt: vi.fn(),
    loggVisning: vi.fn(),
}));

// Mocker server-action-modulene som ForsideWrapper importerer.
// Disse har 'use server' og importerer next/headers som ikke finnes i jsdom.
vi.mock('@/app/lib/oppslag/snapshot', () => ({
    getSnapshot: vi.fn(),
}));

vi.mock('@/app/lib/bekreftelser/bekreftelse', () => ({
    getBekreftelser: vi.fn(),
}));

import { act, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { ModiaProvider } from '@/app/contexts/modia-context';
import type { BekreftelseApiResult } from '@/app/lib/bekreftelser/bekreftelse';
import type { SnapshotResult } from '@/app/lib/oppslag/snapshot';
import bekreftelserMock from '@/app/mocks/bekfreftelser.json';
import snapshotMock from '@/app/mocks/snapshot.json';
import snapshotMockAvsluttet from '@/app/mocks/snapshot-med-avsluttet.json';
import { Forside } from './Forside';
import { ForsideWrapper } from './ForsideWrapper';

// ———————————————————————————————————————————————————
// Test-data
// ———————————————————————————————————————————————————

const happySnapshotMedPaagaaende: SnapshotResult = {
    snapshot: snapshotMock as SnapshotResult['snapshot'],
};

const happySnapshotMedAvsluttet: SnapshotResult = {
    snapshot: snapshotMockAvsluttet as SnapshotResult['snapshot'],
};

const happyBekreftelser: BekreftelseApiResult = {
    bekreftelser: bekreftelserMock,
};

const emptyBekreftelser: BekreftelseApiResult = {
    bekreftelser: [],
};

const errorSnapshot: SnapshotResult = {
    snapshot: null,
    error: new Error('Noe gikk galt'),
};

const errorBekreftelser: BekreftelseApiResult = {
    bekreftelser: null,
    error: new Error('Bekreftelse-feil'),
};

const nullSnapshot: SnapshotResult = {
    snapshot: null,
};

const problemDetailsSnapshot: SnapshotResult = {
    snapshot: null,
    notFound: true,
};

// ———————————————————————————————————————————————————
// Hjelpere
//
// Siden vi bruker use(), må vi bruke noe spess saker
// for at promise skal kunne testes skikkelig.
// Wrappe render i "act" var visst løsningen.
// ———————————————————————————————————————————————————

async function renderForside(snapshotResult: SnapshotResult, bekreftelserResult: BekreftelseApiResult) {
    await act(async () => {
        render(
            <Suspense fallback={<div>Loading...</div>}>
                <Forside
                    snapshotPromise={Promise.resolve(snapshotResult)}
                    bekreftelserPromise={Promise.resolve(bekreftelserResult)}
                />
            </Suspense>,
        );
    });
}

async function renderForsideWrapper(snapshotResult: SnapshotResult, bekreftelserResult: BekreftelseApiResult) {
    await act(async () => {
        render(
            <ModiaProvider initFnr='12345678910' initEnhetId='0219'>
                <Suspense fallback={<div>Loading...</div>}>
                    <ForsideWrapper
                        initialSnapshotPromise={Promise.resolve(snapshotResult)}
                        initialBekreftelserPromise={Promise.resolve(bekreftelserResult)}
                    />
                </Suspense>
            </ModiaProvider>,
        );
    });
}

// ———————————————————————————————————————————————————
// Forside
// ———————————————————————————————————————————————————

describe('Forside', () => {
    describe('happy path — snapshot og bekreftelser lastes', () => {
        beforeEach(async () => {
            await renderForside(happySnapshotMedPaagaaende, happyBekreftelser);
        });

        it('viser at personen er registrert som arbeidssøker', () => {
            expect(screen.getByText('Personen er registrert som arbeidssøker')).toBeDefined();
        });

        it('viser registreringstidspunkt og hvem som registrerte', () => {
            expect(screen.getByText(/Registrert.*av bruker/)).toBeDefined();
        });

        it('viser opplysninger-seksjonen', () => {
            expect(screen.getByText('Opplysninger')).toBeDefined();
        });

        it('viser bekreftelse-seksjonen med riktig antall', () => {
            expect(screen.getByText('Bekreftelse')).toBeDefined();
            expect(screen.getByText(/Personen har en ubekreftet arbeidssøkerperiode/)).toBeDefined();
        });

        it('viser knapp for å bekrefte arbeidssøkerperiode', () => {
            expect(screen.getByText('Bekreft arbeidssøkerperiode på vegne av bruker')).toBeDefined();
        });

        it('viser lenke til historikk', () => {
            expect(screen.getByText('Se tidligere arbeidssøkerperioder og opplysninger')).toBeDefined();
        });

        it('viser lenke til tidslinjer', () => {
            expect(screen.getByText('Se tidslinjer for arbeidssøkerperioder')).toBeDefined();
        });
    });

    describe('ingen tilgjengelige bekreftelser', () => {
        it('viser ikke bekreftelse-seksjonen', async () => {
            await renderForside(happySnapshotMedPaagaaende, emptyBekreftelser);
            // Bekreftelse returnerer null når antall er 0/falsy
            expect(screen.getByText('Personen er registrert som arbeidssøker')).toBeDefined();
            expect(screen.queryByText('Bekreftelse')).toBeNull();
        });
    });

    describe('feil ved henting av snapshot', () => {
        it('viser generell feilmelding', async () => {
            await renderForside(errorSnapshot, happyBekreftelser);
            expect(screen.getByText('Noe gikk dessverre galt. Prøv igjen senere')).toBeDefined();
        });

        it('viser ikke registreringsinformasjon', async () => {
            await renderForside(errorSnapshot, happyBekreftelser);
            expect(screen.queryByText('Personen er registrert som arbeidssøker')).toBeNull();
        });
    });

    describe('feil ved henting av bekreftelser', () => {
        it('viser generell feilmelding', async () => {
            await renderForside(happySnapshotMedPaagaaende, errorBekreftelser);
            expect(screen.getByText('Noe gikk dessverre galt. Prøv igjen senere')).toBeDefined();
        });
    });

    describe('snapshot er null uten feil', () => {
        it('viser ikke-aktiv-forside', async () => {
            await renderForside(nullSnapshot, happyBekreftelser);
            expect(screen.getByText('Personen er ikke registrert som arbeidssøker')).toBeDefined();
        });
    });

    describe('snapshot hvor periode er avsluttet', () => {
        it('viser ikke-aktiv-forside når person har gyldig snapshot, men perioden er avsluttet', async () => {
            await renderForside(happySnapshotMedAvsluttet, emptyBekreftelser);
            expect(screen.getByText('Personen er ikke registrert som arbeidssøker')).toBeDefined();
        });
        it('viser ikke-aktiv-forside selvom bekreftelser finnes (det skal ikke finnes men...)', async () => {
            await renderForside(happySnapshotMedAvsluttet, happyBekreftelser);
            expect(screen.getByText('Personen er ikke registrert som arbeidssøker')).toBeDefined();
        });
    });
    describe('snapshot hvor person aldri har vært registrert før (problem details - periode-ikke-funnet)', () => {
        it('skal viser ikke-aktiv-forside', async () => {
            await renderForside(problemDetailsSnapshot, emptyBekreftelser);
            expect(screen.getByText('Personen er ikke registrert som arbeidssøker')).toBeDefined();
            expect(screen.getByText('Har ikke vært registrert som arbeidssøker')).toBeDefined();
        });
        it('skal viser ikke-aktiv-forside, gyldige bekreftelser skal ikke påvirke dette', async () => {
            await renderForside(problemDetailsSnapshot, happyBekreftelser);
            expect(screen.getByText('Personen er ikke registrert som arbeidssøker')).toBeDefined();
            expect(screen.getByText('Har ikke vært registrert som arbeidssøker')).toBeDefined();
        });
    });
});

// ———————————————————————————————————————————————————
// ForsideWrapper — integrasjon: promise-wiring → Forside
// ———————————————————————————————————————————————————

describe('ForsideWrapper', () => {
    it('rendrer Forside-innhold når promises resolver', async () => {
        await renderForsideWrapper(happySnapshotMedPaagaaende, happyBekreftelser);
        expect(screen.getByText('Personen er registrert som arbeidssøker')).toBeDefined();
        expect(screen.getByText('Opplysninger')).toBeDefined();
        expect(screen.getByText('Personen har en ubekreftet arbeidssøkerperiode')).toBeDefined();
    });

    it('rendrer feilmelding når snapshot feiler', async () => {
        await renderForsideWrapper(errorSnapshot, happyBekreftelser);
        expect(screen.getByText('Noe gikk dessverre galt. Prøv igjen senere')).toBeDefined();
    });

    it('rendrer Forside-innhold når bekreftelser er tom', async () => {
        await renderForsideWrapper(happySnapshotMedPaagaaende, emptyBekreftelser);
        expect(screen.getByText('Personen er registrert som arbeidssøker')).toBeDefined();
        expect(screen.getByText('Opplysninger')).toBeDefined();
        expect(screen.queryByText('Personen har en ubekreftet arbeidssøkerperiode')).toBeNull();
    });
});
