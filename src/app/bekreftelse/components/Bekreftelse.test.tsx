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
}));

vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('@/contexts/modia-context', () => ({
    useModiaContext: () => ({
        fnr: '12345678910',
        enhetId: '0219',
        setFnr: vi.fn(),
        setEnhetId: vi.fn(),
    }),
}));

const sendBekreftelseMock = vi.fn();

vi.mock('@/lib/api/bekreftelse', () => ({
    sendBekreftelse: (...args: unknown[]) => sendBekreftelseMock(...args),
}));

// ———————————————————————————————————————————————————
// Imports (after mocks)
// ———————————————————————————————————————————————————

import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import type { BekreftelseApiResult } from '@/lib/api/bekreftelse';
import flereBekreftelser from '@/lib/mocks/bekreftelser-flere.json';
import { Bekreftelse } from './Bekreftelse';

// ———————————————————————————————————————————————————
// Test data
// ———————————————————————————————————————————————————

const enBekreftelse: TilgjengeligBekreftelse = {
    periodeId: 'a43abadd-5f86-41e0-9b69-31d091861252',
    bekreftelseId: '2de9cd37-d2d4-4876-baa2-bab1b7c5733e',
    gjelderFra: '2026-02-11T09:40:09.652Z',
    gjelderTil: '2026-02-22T23:00:00Z',
};

const happyResult: BekreftelseApiResult = {
    bekreftelser: [enBekreftelse],
};

const emptyResult: BekreftelseApiResult = {
    bekreftelser: [],
};

const errorResult: BekreftelseApiResult = {
    bekreftelser: null,
    error: new Error('Noe gikk galt'),
};

const flereResult: BekreftelseApiResult = {
    bekreftelser: flereBekreftelser as TilgjengeligBekreftelse[],
};

// ———————————————————————————————————————————————————
// Helpers
// ———————————————————————————————————————————————————

async function renderBekreftelse(result: BekreftelseApiResult) {
    await act(async () => {
        render(
            <Suspense fallback={<div>Laster…</div>}>
                <Bekreftelse bekreftelserPromise={Promise.resolve(result)} />
            </Suspense>,
        );
    });
}

function velgRadio(legend: string | RegExp, value: string) {
    const fieldset = screen.getByRole('group', { name: legend });
    const radio = Array.from(fieldset.querySelectorAll('input[type="radio"]')).find(
        (r) => (r as HTMLInputElement).value === value,
    ) as HTMLInputElement;
    fireEvent.click(radio);
}

function hentSendInnKnapp() {
    return screen.getByRole('button', { name: 'Send inn' });
}

// ———————————————————————————————————————————————————
// Tests
// ———————————————————————————————————————————————————

describe('Bekreftelse', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Tilstand ved oppstart', () => {
        it('viser melding når det ikke finnes tilgjengelige bekreftelser', async () => {
            await renderBekreftelse(emptyResult);

            expect(screen.getByText('Ingen tilgjengelige bekreftelser')).toBeDefined();
            expect(screen.queryByRole('button', { name: 'Send inn' })).toBeNull();
        });

        it('viser feilmelding når henting av bekreftelser feiler', async () => {
            await renderBekreftelse(errorResult);

            expect(screen.getByText('Noe gikk dessverre galt. Prøv igjen senere')).toBeDefined();
            expect(screen.queryByRole('button', { name: 'Send inn' })).toBeNull();
        });
    });

    describe('Én bekreftelse', () => {
        it('viser disabled skjema og suksess-kvittering etter vellykket innsending', async () => {
            sendBekreftelseMock.mockResolvedValue({ ok: true });
            await renderBekreftelse(happyResult);

            // Fyll ut begge radio-grupper
            velgRadio(/Har personen vært i arbeid i perioden/, 'ja');
            velgRadio('Vil personen fortsatt være registrert som arbeidssøker?', 'ja');

            // Send inn
            await act(async () => {
                fireEvent.click(hentSendInnKnapp());
            });

            // Skjema er fortsatt synlig men disabled
            const radioer = screen.getAllByRole('radio');
            radioer.forEach((radio) => {
                expect((radio as HTMLInputElement).disabled).toBe(true);
            });

            // Knappene er borte
            expect(screen.queryByRole('button', { name: 'Send inn' })).toBeNull();
            expect(screen.queryByRole('button', { name: 'Avbryt' })).toBeNull();

            // Suksess-kvittering vises
            expect(screen.getByText('Bekreftelsen er registrert')).toBeDefined();
            expect(screen.getByText('Gå tilbake til forsiden')).toBeDefined();
        });

        it('viser advarsel-kvittering når bruker ikke vil fortsette som arbeidssøker', async () => {
            sendBekreftelseMock.mockResolvedValue({ ok: true });
            await renderBekreftelse(happyResult);

            velgRadio(/Har personen vært i arbeid i perioden/, 'ja');
            velgRadio('Vil personen fortsatt være registrert som arbeidssøker?', 'nei');

            // Advarsel vises FØR innsending
            expect(
                screen.getByText(
                    'Bruker vil ikke lenger være registrert som arbeidssøker, og eventuell pengestøtte vil stanses.',
                ),
            ).toBeDefined();

            await act(async () => {
                fireEvent.click(hentSendInnKnapp());
            });

            // Kvittering med advarsel vises ETTER innsending
            expect(screen.getByText('Bruker er ikke lenger registrert som arbeidssøker')).toBeDefined();
            expect(screen.getByText('Gå tilbake til forsiden')).toBeDefined();

            // Ingen "Svar for neste periode"-knapp
            expect(screen.queryByRole('button', { name: 'Svar for neste periode' })).toBeNull();
        });

        it('viser feilmelding og lar bruker prøve på nytt ved feil under innsending', async () => {
            sendBekreftelseMock.mockResolvedValue({ ok: false, error: 'Teknisk feil' });
            await renderBekreftelse(happyResult);

            velgRadio(/Har personen vært i arbeid i perioden/, 'ja');
            velgRadio('Vil personen fortsatt være registrert som arbeidssøker?', 'ja');

            await act(async () => {
                fireEvent.click(hentSendInnKnapp());
            });

            // Feilmelding vises
            expect(screen.getByText('Teknisk feil')).toBeDefined();

            // Skjema er IKKE disabled — radioer er fortsatt interaktive
            const radioer = screen.getAllByRole('radio');
            radioer.forEach((radio) => {
                expect((radio as HTMLInputElement).disabled).toBe(false);
            });

            // Send inn-knappen er fortsatt tilgjengelig for retry
            expect(screen.getByRole('button', { name: 'Send inn' })).toBeDefined();

            // Retry — nå lykkes det
            sendBekreftelseMock.mockResolvedValue({ ok: true });

            await act(async () => {
                fireEvent.click(hentSendInnKnapp());
            });

            // Feilmeldingen er borte, suksess vises
            expect(screen.queryByText('Teknisk feil')).toBeNull();
            expect(screen.getByText('Bekreftelsen er registrert')).toBeDefined();
        });
    });

    describe('Flere bekreftelser', () => {
        it('lar bruker bekrefte flere perioder etter hverandre', async () => {
            sendBekreftelseMock.mockResolvedValue({ ok: true });
            await renderBekreftelse(flereResult);

            // Første bekreftelse — fyll ut og send inn
            velgRadio(/Har personen vært i arbeid i perioden/, 'ja');
            velgRadio('Vil personen fortsatt være registrert som arbeidssøker?', 'ja');

            await act(async () => {
                fireEvent.click(hentSendInnKnapp());
            });

            // "Svar for neste periode"-knappen vises
            expect(screen.getByRole('button', { name: 'Svar for neste periode' })).toBeDefined();
            expect(screen.queryByText('Gå tilbake til forsiden')).toBeNull();

            // Gå til neste bekreftelse
            await act(async () => {
                fireEvent.click(screen.getByRole('button', { name: 'Svar for neste periode' }));
            });

            // Skjemaet er tilbakestilt — Send inn-knappen er synlig igjen
            expect(screen.getByRole('button', { name: 'Send inn' })).toBeDefined();

            // Andre bekreftelse — fyll ut og send inn
            velgRadio(/Har personen vært i arbeid i perioden/, 'nei');
            velgRadio('Vil personen fortsatt være registrert som arbeidssøker?', 'ja');

            await act(async () => {
                fireEvent.click(hentSendInnKnapp());
            });

            // Ingen flere bekreftelser — viser endelig kvittering
            expect(screen.queryByRole('button', { name: 'Svar for neste periode' })).toBeNull();
            expect(screen.getByText('Bekreftelsen er registrert')).toBeDefined();
            expect(screen.getByText('Gå tilbake til forsiden')).toBeDefined();
        });

        it('avslutter flyten uten å vise neste bekreftelse når bruker ikke vil fortsette', async () => {
            sendBekreftelseMock.mockResolvedValue({ ok: true });
            await renderBekreftelse(flereResult);

            // Første bekreftelse — fyll ut med vilFortsette = nei
            velgRadio(/Har personen vært i arbeid i perioden/, 'ja');
            velgRadio('Vil personen fortsatt være registrert som arbeidssøker?', 'nei');

            await act(async () => {
                fireEvent.click(hentSendInnKnapp());
            });

            // Ingen "Svar for neste periode"-knapp — flyten er ferdig
            expect(screen.queryByRole('button', { name: 'Svar for neste periode' })).toBeNull();

            // Advarsel-kvittering vises
            expect(screen.getByText('Bruker er ikke lenger registrert som arbeidssøker')).toBeDefined();
            expect(screen.getByText('Gå tilbake til forsiden')).toBeDefined();
        });
    });
});
