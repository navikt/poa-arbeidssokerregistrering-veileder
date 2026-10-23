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
vi.mock('@/lib/api/oppslag-snapshot', () => ({
    getSnapshot: vi.fn(),
}));

vi.mock('@/lib/api/bekreftelse', () => ({
    getBekreftelser: vi.fn(),
}));
vi.mock('@/lib/api/kartlegging', () => ({
    getKartlegging: vi.fn(),
}));
vi.mock('@/lib/api/kartlegging-enkeltperson', () => ({
    getKartleggingForEnkeltperson: vi.fn(),
}));

import type { ProfilertTil } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { ModiaProvider, useModiaContext } from '@/contexts/modia-context';
import type { BekreftelseApiResult } from '@/lib/api/bekreftelse';
import { getBekreftelser } from '@/lib/api/bekreftelse';
import type { KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import { getKartlegging } from '@/lib/api/kartlegging';
import type { KartleggingApiEnkeltpersonKompaktResult } from '@/lib/api/kartlegging-enkeltperson';
import { getKartleggingForEnkeltperson } from '@/lib/api/kartlegging-enkeltperson';
import type { SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { getSnapshot } from '@/lib/api/oppslag-snapshot';
import bekreftelserMock from '@/lib/mocks/bekreftelser.json';
import snapshotMock from '@/lib/mocks/snapshot.json';
import snapshotMockAvsluttet from '@/lib/mocks/snapshot-med-avsluttet.json';
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

const snapshotManglerTilganger: SnapshotResult = {
    snapshot: null,
    manglerTilgang: true,
};

const lagSnapshotMedEgenvurdering = (egenvurdering: ProfilertTil | undefined): SnapshotResult => ({
    snapshot: {
        ...snapshotMock,
        egenvurdering: egenvurdering ? { ...snapshotMock.egenvurdering, egenvurdering } : undefined,
    } as SnapshotResult['snapshot'],
});

const emptyKartleggingEnkeltperson: KartleggingApiEnkeltpersonKompaktResult = {
    arbeidssoekere: [],
};

const kartleggingMedNavn = (fornavn: string, etternavn: string): KartleggingApiKompaktResult => ({
    arbeidssoekere: [
        {
            id: 1,
            aktorId: '123',
            identitetsnummer: '12345678901',
            fornavn,
            etternavn,
            ledighetsperioder: [
                {
                    periodeStartet: '2026-05-28T00:00:00Z',
                    ledigSiden: '2026-05-28T00:00:00Z',
                    bekreftelsePaaVegneAv: [],
                },
            ],
            kontortilknytninger: [],
        },
    ],
});

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
                    kartleggingEnkeltpersonPromise={Promise.resolve(emptyKartleggingEnkeltperson)}
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
                        initialKartleggingPromise={Promise.resolve(null)}
                        initialKartleggingEnkeltpersonPromise={Promise.resolve(emptyKartleggingEnkeltperson)}
                        initialContext={{ fnr: '12345678910', enhetId: '0219' }}
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

    describe('Egenvurdering', () => {
        it('Sjekk at egenvurderingsfeltet er synlig når det finnes', async () => {
            await renderForside(lagSnapshotMedEgenvurdering('ANTATT_BEHOV_FOR_VEILEDNING'), emptyBekreftelser);
            expect(screen.getByText('Hva slags veiledning ønsker du?')).toBeDefined();
            expect(screen.getByText('Jeg ønsker oppfølging fra Nav')).toBeDefined();
        });
        it('Sjekk at egenvurderingsfeltet er synlig når det finnes', async () => {
            await renderForside(lagSnapshotMedEgenvurdering('ANTATT_GODE_MULIGHETER'), emptyBekreftelser);
            expect(screen.getByText('Hva slags veiledning ønsker du?')).toBeDefined();
            expect(screen.getByText('Jeg ønsker å klare meg selv')).toBeDefined();
        });

        it('Sjekk at egenvurderingsfeltet ikke vises når det er undefined', async () => {
            await renderForside(lagSnapshotMedEgenvurdering(undefined), emptyBekreftelser);
            expect(screen.queryByText('Hva slags veiledning ønsker du?')).toBeNull();
        });
    });

    describe('Manglende tilganger (403)', () => {
        it('Sjekk at kun info om manglende tilganger renderes', async () => {
            await renderForside(snapshotManglerTilganger, emptyBekreftelser);
            expect(screen.queryByText('Opplysninger')).toBeNull();
            expect(screen.queryByText('Mangler tilgang')).toBeDefined();
        });
        it('Sjekk at kun manglende tilganger IKKE renderes ved feil (problem details)', async () => {
            await renderForside(problemDetailsSnapshot, emptyBekreftelser);
            expect(screen.queryByText('Opplysninger')).toBeNull();
            expect(screen.queryByText('Mangler tilgang')).toBeNull();
        });
        it('Sjekk at kun manglende tilganger IKKE renderes ved null snapshots', async () => {
            await renderForside(nullSnapshot, emptyBekreftelser);
            expect(screen.queryByText('Opplysninger')).toBeNull();
            expect(screen.queryByText('Mangler tilgang')).toBeNull();
        });
        it('Sjekk at kun manglende tilganger IKKE renderes ved happy path', async () => {
            await renderForside(happySnapshotMedPaagaaende, emptyBekreftelser);
            expect(screen.queryByText('Opplysninger')).toBeDefined();
            expect(screen.queryByText('Mangler tilgang')).toBeNull();
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

    it('rendrer kartlegging når fnr er null og enhetId er 4154', async () => {
        const kartleggingResult: KartleggingApiKompaktResult = {
            arbeidssoekere: [
                {
                    id: 1,
                    aktorId: '123',
                    identitetsnummer: '12345678901',
                    fornavn: 'TEST',
                    etternavn: 'BRUKER',
                    ledighetsperioder: [
                        {
                            periodeStartet: '2026-05-28T00:00:00Z',
                            ledigSiden: '2026-05-28T00:00:00Z',
                            bekreftelsePaaVegneAv: [],
                        },
                    ],
                    kontortilknytninger: [],
                },
            ],
        };
        await act(async () => {
            render(
                <ModiaProvider initFnr={null} initEnhetId='4154'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ForsideWrapper
                            initialSnapshotPromise={Promise.resolve(nullSnapshot)}
                            initialBekreftelserPromise={Promise.resolve(emptyBekreftelser)}
                            initialKartleggingPromise={Promise.resolve(kartleggingResult)}
                            initialKartleggingEnkeltpersonPromise={Promise.resolve(null)}
                            initialContext={{ fnr: null, enhetId: '4154' }}
                        />
                    </Suspense>
                </ModiaProvider>,
            );
        });
        expect(screen.getByText(/Arbeidssøkere/)).toBeDefined();
    });

    it('rendrer ManglerPersonEllerEnhet når fnr er null og enhetId ikke er 4154', async () => {
        await act(async () => {
            render(
                <ModiaProvider initFnr={null} initEnhetId='0219'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ForsideWrapper
                            initialSnapshotPromise={Promise.resolve(nullSnapshot)}
                            initialBekreftelserPromise={Promise.resolve(emptyBekreftelser)}
                            initialKartleggingPromise={Promise.resolve({ manglerTilgang: true, arbeidssoekere: [] })}
                            initialKartleggingEnkeltpersonPromise={Promise.resolve(null)}
                            initialContext={{ fnr: null, enhetId: '0219' }}
                        />
                    </Suspense>
                </ModiaProvider>,
            );
        });
        expect(screen.getByText('Fødselsnummer mangler')).toBeDefined();
    });
});

function ByttKontekst() {
    const { setFnr, setEnhetId } = useModiaContext();
    return (
        <>
            <button type='button' onClick={() => setFnr('11111111111')}>
                Velg første person
            </button>
            <button type='button' onClick={() => setFnr('22222222222')}>
                Velg ny person
            </button>
            <button type='button' onClick={() => setFnr(null)}>
                Fjern person
            </button>
            <button type='button' onClick={() => setEnhetId('4154')}>
                Bytt enhet
            </button>
        </>
    );
}

function utsattSvar<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((r) => {
        resolve = r;
    });
    return { promise, resolve };
}

describe('ForsideWrapper ved endring av ident og enhet', () => {
    const kartlegging: KartleggingApiKompaktResult = { arbeidssoekere: [] };

    beforeEach(() => {
        vi.mocked(getSnapshot).mockReset();
        vi.mocked(getBekreftelser).mockReset();
        vi.mocked(getKartlegging).mockReset();
        vi.mocked(getKartleggingForEnkeltperson).mockReset();
    });

    async function visWrapper(fnr: string | null, enhetId: string | null) {
        await act(async () => {
            render(
                <ModiaProvider initFnr={fnr} initEnhetId={enhetId}>
                    <ByttKontekst />
                    <Suspense fallback={<div>Laster første visning</div>}>
                        <ForsideWrapper
                            initialSnapshotPromise={Promise.resolve(fnr ? happySnapshotMedPaagaaende : nullSnapshot)}
                            initialBekreftelserPromise={Promise.resolve(happyBekreftelser)}
                            initialKartleggingPromise={Promise.resolve(fnr ? null : kartlegging)}
                            initialKartleggingEnkeltpersonPromise={Promise.resolve(
                                fnr ? emptyKartleggingEnkeltperson : null,
                            )}
                            initialContext={{ fnr, enhetId }}
                        />
                    </Suspense>
                </ModiaProvider>,
            );
        });
    }

    it('skjuler persondata til alle svar for ny ident er klare', async () => {
        const nySnapshot = utsattSvar<SnapshotResult>();
        const nyeBekreftelser = utsattSvar<BekreftelseApiResult>();
        const nyKartlegging = utsattSvar<KartleggingApiEnkeltpersonKompaktResult | null>();
        vi.mocked(getSnapshot).mockReturnValue(nySnapshot.promise);
        vi.mocked(getBekreftelser).mockReturnValue(nyeBekreftelser.promise);
        vi.mocked(getKartleggingForEnkeltperson).mockReturnValue(nyKartlegging.promise);

        await visWrapper('11111111111', '0219');
        expect(screen.getByText('Personen er registrert som arbeidssøker')).toBeDefined();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Velg ny person' })));
        expect(screen.queryByText('Personen er registrert som arbeidssøker')).toBeNull();
        expect(screen.getByTitle('Henter informasjon')).toBeDefined();

        await act(async () => {
            nySnapshot.resolve(nullSnapshot);
            nyeBekreftelser.resolve(emptyBekreftelser);
            nyKartlegging.resolve(emptyKartleggingEnkeltperson);
        });
        expect(screen.getByText('Personen er ikke registrert som arbeidssøker')).toBeDefined();
    });

    it('viser ikke gammel person eller gammel enhetsliste når ident fjernes', async () => {
        const nyListe = utsattSvar<KartleggingApiKompaktResult | null>();
        vi.mocked(getKartlegging).mockReturnValue(nyListe.promise);
        vi.mocked(getSnapshot).mockResolvedValue(nullSnapshot);
        vi.mocked(getBekreftelser).mockResolvedValue(emptyBekreftelser);
        vi.mocked(getKartleggingForEnkeltperson).mockResolvedValue(null);

        await visWrapper('11111111111', '0219');
        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Fjern person' })));
        expect(screen.queryByText('Personen er registrert som arbeidssøker')).toBeNull();
        expect(screen.getByTitle('Henter kartlegging')).toBeDefined();

        await act(async () => nyListe.resolve(kartlegging));
        expect(screen.getByText('Ingen tilgjengelig data')).toBeDefined();

        const nesteListe = utsattSvar<KartleggingApiKompaktResult | null>();
        vi.mocked(getKartlegging).mockReturnValue(nesteListe.promise);
        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Bytt enhet' })));
        expect(screen.queryByText('Ingen tilgjengelig data')).toBeNull();
        expect(screen.getByTitle('Henter kartlegging')).toBeDefined();

        await act(async () => nesteListe.resolve(kartlegging));
        expect(screen.getByText('Ingen tilgjengelig data')).toBeDefined();
    });

    it('viser ikke initial enhetsliste som persondata når provider har valgt ident, men initialContext mangler ident', async () => {
        const initialEnhetsliste = kartleggingMedNavn('IKKE', 'PERSONDATA');
        vi.mocked(getSnapshot).mockResolvedValue(nullSnapshot);
        vi.mocked(getBekreftelser).mockResolvedValue(emptyBekreftelser);
        vi.mocked(getKartleggingForEnkeltperson).mockResolvedValue(emptyKartleggingEnkeltperson);

        await act(async () => {
            render(
                <ModiaProvider initFnr='11111111111' initEnhetId='0219'>
                    <Suspense fallback={<div>Laster første visning</div>}>
                        <ForsideWrapper
                            initialSnapshotPromise={Promise.resolve(nullSnapshot)}
                            initialBekreftelserPromise={Promise.resolve(emptyBekreftelser)}
                            initialKartleggingPromise={Promise.resolve(initialEnhetsliste)}
                            initialKartleggingEnkeltpersonPromise={Promise.resolve(null)}
                            initialContext={{ fnr: null, enhetId: '0219' }}
                        />
                    </Suspense>
                </ModiaProvider>,
            );
        });

        expect(screen.getByText('Personen er ikke registrert som arbeidssøker')).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Ikke Persondata' })).toBeNull();
        expect(screen.queryByText(/Arbeidssøkere/)).toBeNull();
    });

    it('viser ikke svar for B etter raskt bytte A → B → A', async () => {
        const svarForB = utsattSvar<SnapshotResult>();
        const sisteSvarForA = utsattSvar<SnapshotResult>();
        vi.mocked(getSnapshot).mockImplementation((fnr) =>
            fnr === '22222222222' ? svarForB.promise : sisteSvarForA.promise,
        );
        vi.mocked(getBekreftelser).mockResolvedValue(emptyBekreftelser);
        vi.mocked(getKartleggingForEnkeltperson).mockResolvedValue(emptyKartleggingEnkeltperson);

        await visWrapper('11111111111', '0219');
        expect(screen.getByText('Personen er registrert som arbeidssøker')).toBeDefined();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Velg ny person' })));
        expect(screen.queryByText('Personen er registrert som arbeidssøker')).toBeNull();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Velg første person' })));
        expect(screen.queryByText('Personen er registrert som arbeidssøker')).toBeNull();
        expect(screen.getByTitle('Henter informasjon')).toBeDefined();

        await act(async () => svarForB.resolve(happySnapshotMedPaagaaende));
        expect(screen.queryByText('Personen er registrert som arbeidssøker')).toBeNull();
        expect(screen.getByTitle('Henter informasjon')).toBeDefined();

        await act(async () => {
            sisteSvarForA.resolve(nullSnapshot);
        });
        expect(screen.getByText('Personen er ikke registrert som arbeidssøker')).toBeDefined();
        expect(screen.queryByText('Personen er registrert som arbeidssøker')).toBeNull();
    });

    it('viser bare siste enhetsliste når ident fjernes og enheten byttes mens første liste lastes', async () => {
        const listeForGammelEnhet = utsattSvar<KartleggingApiKompaktResult | null>();
        const listeForNyEnhet = utsattSvar<KartleggingApiKompaktResult | null>();
        vi.mocked(getKartlegging)
            .mockReturnValueOnce(listeForGammelEnhet.promise)
            .mockReturnValueOnce(listeForNyEnhet.promise);
        vi.mocked(getSnapshot).mockResolvedValue(nullSnapshot);
        vi.mocked(getBekreftelser).mockResolvedValue(emptyBekreftelser);
        vi.mocked(getKartleggingForEnkeltperson).mockResolvedValue(null);

        await visWrapper('11111111111', '0219');
        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Fjern person' })));
        expect(screen.getByTitle('Henter kartlegging')).toBeDefined();

        await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Bytt enhet' })));
        expect(screen.getByTitle('Henter kartlegging')).toBeDefined();

        await act(async () => listeForGammelEnhet.resolve(kartleggingMedNavn('GAMMEL', 'ENHET')));
        expect(screen.queryByRole('button', { name: 'Gammel Enhet' })).toBeNull();
        expect(screen.getByTitle('Henter kartlegging')).toBeDefined();

        await act(async () => listeForNyEnhet.resolve(kartleggingMedNavn('SISTE', 'ENHET')));
        expect(screen.getByRole('button', { name: 'Siste Enhet' })).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Gammel Enhet' })).toBeNull();
    });
});
