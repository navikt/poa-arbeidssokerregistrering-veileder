// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

// ———————————————————————————————————————————————————
// Mocks — must be declared before imports
// ———————————————————————————————————————————————————

const pushMock = vi.fn();
const searchParamsMock = new URLSearchParams();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => searchParamsMock,
}));

vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

const mockFnr = vi.fn<() => string | null>(() => '12345678910');

vi.mock('@/contexts/modia-context', () => ({
    useModiaContext: () => ({
        fnr: mockFnr(),
        enhetId: '0219',
        setFnr: vi.fn(),
        setEnhetId: vi.fn(),
    }),
}));

vi.mock('@/lib/tracking', () => ({
    loggAktivitet: vi.fn(),
    loggFlyt: vi.fn(),
    loggVisning: vi.fn(),
}));

const mockRegistrerOpplysninger = vi.fn<(...args: unknown[]) => Promise<{ ok: boolean; error?: string }>>();
const mockStartPeriode = vi.fn<(...args: unknown[]) => Promise<{ ok: boolean; error?: string }>>();

vi.mock('@/lib/api/inngang-opplysninger', () => ({
    registrerOpplysninger: (...args: unknown[]) => mockRegistrerOpplysninger(...args),
}));

vi.mock('@/lib/api/inngang-start-periode', () => ({
    startPeriode: (...args: unknown[]) => mockStartPeriode(...args),
}));

// Stub child components — we test OpplysningerSkjema's orchestration, not children
vi.mock('@/app/components/skjema/DinSituasjon', () => ({
    DinSituasjon: () => <div data-testid='din-situasjon'>DinSituasjon</div>,
}));

vi.mock('@/app/components/skjema/SisteJobb', () => ({
    SisteJobb: () => <div data-testid='siste-jobb'>SisteJobb</div>,
}));

vi.mock('@/app/components/skjema/Utdanning', () => ({
    Utdanning: () => <div data-testid='utdanning'>Utdanning</div>,
}));

vi.mock('@/app/components/skjema/Hindringer', () => ({
    Hindringer: () => <div data-testid='hindringer'>Hindringer</div>,
}));

vi.mock('@/app/registrering-arbeidssoker/components/GenereltOmSamtykke', () => ({
    GenereltOmSamtykke: () => <div data-testid='generelt-om-samtykke'>GenereltOmSamtykke</div>,
}));

const mockValidateRegistrering = vi.fn<() => boolean>(() => false);

vi.mock('./valider-registrering', () => ({
    validateRegistrering: () => mockValidateRegistrering(),
}));

// ———————————————————————————————————————————————————
// Imports (after mocks)
// ———————————————————————————————————————————————————

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { loggFlyt } from '@/lib/tracking';
import type { RegistreringState } from '@/model/registrering';
import { OpplysningerSkjema } from './OpplysningerSkjema';

// ———————————————————————————————————————————————————
// Test data
// ———————————————————————————————————————————————————

const EMPTY_STATE: RegistreringState = {};

const VALID_STATE: RegistreringState = {
    dinSituasjon: 'MISTET_JOBBEN' as RegistreringState['dinSituasjon'],
    utdanning: 'GRUNNSKOLE' as RegistreringState['utdanning'],
    utdanningGodkjent: 'INGEN_SVAR' as RegistreringState['utdanningGodkjent'],
    utdanningBestatt: 'INGEN_SVAR' as RegistreringState['utdanningBestatt'],
    helseHinder: 'NEI' as RegistreringState['helseHinder'],
    andreForhold: 'NEI' as RegistreringState['andreForhold'],
    sisteStilling: 'INGEN_SVAR' as RegistreringState['sisteStilling'],
    sisteJobb: { label: 'Kokk', konseptId: 12345, styrk08: '5120' },
};

// ———————————————————————————————————————————————————
// Helpers
// ———————————————————————————————————————————————————

function renderSkjema(mode: 'registrering' | 'oppdater', initState: RegistreringState = EMPTY_STATE) {
    return render(<OpplysningerSkjema initState={initState} mode={mode} />);
}

async function clickSubmit() {
    const button = screen.getByRole('button', { name: /registrer|oppdater/i });
    await act(async () => {
        fireEvent.click(button);
    });
}

// ———————————————————————————————————————————————————
// Tests
// ———————————————————————————————————————————————————

describe('OpplysningerSkjema', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFnr.mockReturnValue('12345678910');
        mockValidateRegistrering.mockReturnValue(false);
        mockRegistrerOpplysninger.mockResolvedValue({ ok: true });
        mockStartPeriode.mockResolvedValue({ ok: true });
        // Reset search params
        searchParamsMock.delete('erForhaandsgodkjent');
    });

    // ———————————————————————————————————————————————
    // Rendering
    // ———————————————————————————————————————————————

    describe('rendering', () => {
        it('rendrer ingenting når fnr er null', () => {
            mockFnr.mockReturnValue(null);
            const { container } = renderSkjema('registrering');
            expect(container.innerHTML).toBe('');
        });

        it('rendrer alle fire skjemaseksjoner', () => {
            renderSkjema('registrering');
            expect(screen.getByTestId('din-situasjon')).toBeDefined();
            expect(screen.getByTestId('siste-jobb')).toBeDefined();
            expect(screen.getByTestId('utdanning')).toBeDefined();
            expect(screen.getByTestId('hindringer')).toBeDefined();
        });

        it('rendrer Avbryt-lenke som peker til forsiden', () => {
            renderSkjema('registrering');
            const avbrytLink = screen.getByRole('link', { name: /avbryt/i });
            expect(avbrytLink).toBeDefined();
            expect(avbrytLink.getAttribute('href')).toBe('/');
        });
    });

    // ———————————————————————————————————————————————
    // Mode-specific rendering
    // ———————————————————————————————————————————————

    describe('registrering mode', () => {
        it('viser "Registrer"-knapp', () => {
            renderSkjema('registrering');
            expect(screen.getByRole('button', { name: 'Registrer' })).toBeDefined();
        });

        it('viser GenereltOmSamtykke', () => {
            renderSkjema('registrering');
            expect(screen.getByTestId('generelt-om-samtykke')).toBeDefined();
        });

        it('logger "Starter registrering av arbeidssøker" ved mount', () => {
            renderSkjema('registrering');
            expect(loggFlyt).toHaveBeenCalledWith({ hendelse: 'Starter registrering av arbeidssøker' });
        });
    });

    describe('oppdater mode', () => {
        it('viser "Oppdater"-knapp', () => {
            renderSkjema('oppdater');
            expect(screen.getByRole('button', { name: 'Oppdater' })).toBeDefined();
        });

        it('viser IKKE GenereltOmSamtykke', () => {
            renderSkjema('oppdater');
            expect(screen.queryByTestId('generelt-om-samtykke')).toBeNull();
        });

        it('logger "Starter reaktivering av arbeidssøker" ved mount', () => {
            renderSkjema('oppdater');
            expect(loggFlyt).toHaveBeenCalledWith({ hendelse: 'Starter reaktivering av arbeidssøker' });
        });
    });

    // ———————————————————————————————————————————————
    // Validation gating
    // ———————————————————————————————————————————————

    describe('validering', () => {
        it('kaller IKKE API-er når skjema er ugyldig', async () => {
            mockValidateRegistrering.mockReturnValue(false);
            renderSkjema('registrering');
            await clickSubmit();

            expect(mockRegistrerOpplysninger).not.toHaveBeenCalled();
            expect(mockStartPeriode).not.toHaveBeenCalled();
        });
    });

    // ———————————————————————————————————————————————
    // Oppdater mode — submit flow
    // ———————————————————————————————————————————————

    describe('oppdater — vellykket innsending', () => {
        beforeEach(() => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockResolvedValue({ ok: true });
        });

        it('kaller registrerOpplysninger med fnr og registreringsstate', async () => {
            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(mockRegistrerOpplysninger).toHaveBeenCalledWith('12345678910', VALID_STATE);
            });
        });

        it('kaller IKKE startPeriode', async () => {
            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(mockStartPeriode).not.toHaveBeenCalled();
            });
        });

        it('redirecter til kvittering-oppdatert-opplysninger', async () => {
            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith('/kvittering-oppdatert-opplysninger');
            });
        });

        it('logger "Opplysninger oppdatert"', async () => {
            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(loggFlyt).toHaveBeenCalledWith({ hendelse: 'Opplysninger oppdatert' });
            });
        });
    });

    describe('oppdater — API returnerer feil', () => {
        it('viser feilmelding fra API', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockResolvedValue({ ok: false, error: 'Bruker ikke funnet' });
            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText('Bruker ikke funnet')).toBeDefined();
            });
        });

        it('redirecter IKKE ved feil', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockResolvedValue({ ok: false, error: 'Noe gikk galt' });
            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText('Noe gikk galt')).toBeDefined();
            });
            expect(pushMock).not.toHaveBeenCalled();
        });

        it('logger "Får ikke oppdatert opplysninger"', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockResolvedValue({ ok: false, error: 'Feil' });
            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(loggFlyt).toHaveBeenCalledWith({ hendelse: 'Får ikke oppdatert opplysninger' });
            });
        });
    });

    // ———————————————————————————————————————————————
    // Registrering mode — submit flow
    // ———————————————————————————————————————————————

    describe('registrering — vellykket innsending', () => {
        beforeEach(() => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockResolvedValue({ ok: true });
            mockStartPeriode.mockResolvedValue({ ok: true });
        });

        it('kaller både startPeriode og registrerOpplysninger', async () => {
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(mockStartPeriode).toHaveBeenCalledWith('12345678910', false);
                expect(mockRegistrerOpplysninger).toHaveBeenCalledWith('12345678910', VALID_STATE);
            });
        });

        it('redirecter til kvittering-arbeidssoker', async () => {
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith('/kvittering-arbeidssoker');
            });
        });

        it('logger riktige hendelser ved fullført registrering', async () => {
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(loggFlyt).toHaveBeenCalledWith({
                    hendelse: 'Sender inn skjema for registrering av arbeidssøker',
                });
                expect(loggFlyt).toHaveBeenCalledWith({ hendelse: 'Opplysninger oppdatert' });
                expect(loggFlyt).toHaveBeenCalledWith({ hendelse: 'Registrering av arbeidssøker fullført' });
            });
        });
    });

    describe('registrering — erForhaandsgodkjent', () => {
        beforeEach(() => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockResolvedValue({ ok: true });
            mockStartPeriode.mockResolvedValue({ ok: true });
        });

        it('sender erForhaandsgodkjent=true til startPeriode når søkeparameter er satt', async () => {
            searchParamsMock.set('erForhaandsgodkjent', 'ja');
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(mockStartPeriode).toHaveBeenCalledWith('12345678910', true);
            });
        });

        it('sender erForhaandsgodkjent=false til startPeriode når søkeparameter ikke er satt', async () => {
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(mockStartPeriode).toHaveBeenCalledWith('12345678910', false);
            });
        });
    });

    // ———————————————————————————————————————————————
    // Registrering mode — error handling
    // ———————————————————————————————————————————————

    describe('registrering — startPeriode feiler', () => {
        beforeEach(() => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockResolvedValue({ ok: true });
        });

        it('viser feilmelding når startPeriode returnerer ok: false', async () => {
            mockStartPeriode.mockResolvedValue({ ok: false, error: 'Periode-feil' });
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText('Periode-feil')).toBeDefined();
            });
        });

        it('viser feilmelding når startPeriode-kallet krasjer (rejected)', async () => {
            mockStartPeriode.mockRejectedValue(new Error('Nettverksfeil'));
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText(/Klarte ikke å starte periode/)).toBeDefined();
            });
        });

        it('redirecter IKKE ved feil', async () => {
            mockStartPeriode.mockResolvedValue({ ok: false, error: 'Kunne ikke starte periode for bruker' });
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText('Kunne ikke starte periode for bruker')).toBeDefined();
            });
            expect(pushMock).not.toHaveBeenCalled();
        });
    });

    describe('registrering — registrerOpplysninger feiler', () => {
        beforeEach(() => {
            mockValidateRegistrering.mockReturnValue(true);
            mockStartPeriode.mockResolvedValue({ ok: true });
        });

        it('viser feilmelding når registrerOpplysninger returnerer ok: false', async () => {
            mockRegistrerOpplysninger.mockResolvedValue({ ok: false, error: 'Opplysninger-feil' });
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText('Opplysninger-feil')).toBeDefined();
            });
        });

        it('viser feilmelding når registrerOpplysninger-kallet krasjer (rejected)', async () => {
            mockRegistrerOpplysninger.mockRejectedValue(new Error('Nettverksfeil'));
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText(/Klarte ikke å lagre opplysninger/)).toBeDefined();
            });
        });
    });

    describe('registrering — begge API-kall feiler', () => {
        it('viser kombinert feilmelding når begge returnerer ok: false', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockStartPeriode.mockResolvedValue({ ok: false, error: 'Periode-feil' });
            mockRegistrerOpplysninger.mockResolvedValue({ ok: false, error: 'Opplysninger-feil' });
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText('Periode-feil, Opplysninger-feil')).toBeDefined();
            });
        });

        it('viser kombinert feilmelding når begge krasjer', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockStartPeriode.mockRejectedValue(new Error('Nettverksfeil 1'));
            mockRegistrerOpplysninger.mockRejectedValue(new Error('Nettverksfeil 2'));
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(
                    screen.getByText('Klarte ikke å starte periode, Klarte ikke å lagre opplysninger'),
                ).toBeDefined();
            });
        });

        it('logger "Får ikke oppdatert opplysninger" ved feil', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockStartPeriode.mockResolvedValue({ ok: false, error: 'Feil' });
            mockRegistrerOpplysninger.mockResolvedValue({ ok: true });
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(loggFlyt).toHaveBeenCalledWith({ hendelse: 'Får ikke oppdatert opplysninger' });
            });
        });

        it('redirecter IKKE når det finnes feil', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockStartPeriode.mockResolvedValue({ ok: false, error: 'Start av periode feilet' });
            mockRegistrerOpplysninger.mockResolvedValue({ ok: true });
            renderSkjema('registrering', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText('Start av periode feilet')).toBeDefined();
            });
            expect(pushMock).not.toHaveBeenCalled();
        });
    });

    // ———————————————————————————————————————————————
    // Exception handling (catch block)
    // ———————————————————————————————————————————————

    describe('uventet exception', () => {
        it('viser generisk feilmelding ved uventet exception i oppdater-modus', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockImplementation(() => {
                throw new Error('Uventet feil');
            });
            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(
                    screen.getByText('Noe gikk galt ved oppdatering av opplysninger. Prøv igjen senere.'),
                ).toBeDefined();
            });
        });
    });

    // ———————————————————————————————————————————————
    // Button state during submission
    // ———————————————————————————————————————————————

    describe('knappetilstand under innsending', () => {
        it('disabler submit-knappen mens innsending pågår', async () => {
            mockValidateRegistrering.mockReturnValue(true);

            // Use a deferred promise so we can check the intermediate state
            let resolvePromise!: (value: { ok: boolean }) => void;
            mockRegistrerOpplysninger.mockReturnValue(
                new Promise((resolve) => {
                    resolvePromise = resolve;
                }),
            );

            renderSkjema('oppdater', VALID_STATE);

            const button = screen.getByRole('button', { name: /oppdater/i });
            expect(button.hasAttribute('disabled')).toBe(false);

            // Click submit — enters pending state
            await act(async () => {
                fireEvent.click(button);
            });

            // Button should be disabled while pending
            expect(button.hasAttribute('disabled')).toBe(true);

            // Resolve the API call
            await act(async () => {
                resolvePromise({ ok: true });
            });
        });
    });

    // ———————————————————————————————————————————————
    // Error clearing on re-submit
    // ———————————————————————————————————————————————

    describe('feilmelding fjernes ved ny innsending', () => {
        it('fjerner forrige feilmelding når bruker prøver igjen', async () => {
            mockValidateRegistrering.mockReturnValue(true);
            mockRegistrerOpplysninger.mockResolvedValue({ ok: false, error: 'Første feil' });

            renderSkjema('oppdater', VALID_STATE);
            await clickSubmit();

            await waitFor(() => {
                expect(screen.getByText('Første feil')).toBeDefined();
            });

            // Second submit — this time successful
            mockRegistrerOpplysninger.mockResolvedValue({ ok: true });
            await clickSubmit();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith('/kvittering-oppdatert-opplysninger');
            });

            // The old error should no longer be visible
            expect(screen.queryByText('Første feil')).toBeNull();
        });
    });
});
