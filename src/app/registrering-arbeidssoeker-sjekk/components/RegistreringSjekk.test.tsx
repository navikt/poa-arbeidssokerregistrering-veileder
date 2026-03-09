// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

// ———————————————————————————————————————————————————
// Mocks — must be declared before importing components
// ———————————————————————————————————————————————————

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: replaceMock,
    }),
}));

vi.mock('@/lib/tracking', () => ({
    loggAktivitet: vi.fn(),
    loggFlyt: vi.fn(),
    loggVisning: vi.fn(),
}));

const replaceMock = vi.fn();

import { act, render, screen } from '@testing-library/react';
import { Suspense } from 'react';

import type { ApiRegelId, KanStartePeriodeFeil, KanStartePeriodeResult } from '@/lib/models/kan-starte-periode';
import { klassifiserAvvisning } from './avvist/klassifiserAvvisning';
import { RegistreringSjekk } from './RegistreringSjekk';

// ———————————————————————————————————————————————————
// Helpers — builders for API responses
// ———————————————————————————————————————————————————

function lagFeil(
    overrides: Partial<KanStartePeriodeFeil> & { regler?: { id: ApiRegelId; beskrivelse: string }[] },
): KanStartePeriodeFeil {
    const { regler, ...rest } = overrides;
    return {
        melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
        feilKode: 'AVVIST',
        ...(regler
            ? {
                  aarsakTilAvvisning: {
                      regler,
                      detaljer: [],
                  },
              }
            : {}),
        ...rest,
    };
}

function lagAvvistResult(feil: KanStartePeriodeFeil): KanStartePeriodeResult {
    return { ok: false, error: feil.melding, feil };
}

function lagOkResult(): KanStartePeriodeResult {
    return { ok: true };
}

function lagFallbackResult(error: string): KanStartePeriodeResult {
    return { ok: false, error };
}

async function renderRegistreringSjekk(result: KanStartePeriodeResult) {
    await act(async () => {
        render(
            <Suspense fallback={<div>Laster…</div>}>
                <RegistreringSjekk kanStartePromise={Promise.resolve(result)} />
            </Suspense>,
        );
    });
}

// ═══════════════════════════════════════════════════
// Part 1: klassifiserAvvisning — pure function tests
// ═══════════════════════════════════════════════════

describe('klassifiserAvvisning', () => {
    // -----------------------------------------------
    // Soft rules — overridable
    // -----------------------------------------------
    describe('myke regler (kan overstyres)', () => {
        it('UNDER_18_AAR → erUnder18Aar=true, kanAlleReglerOverstyres=true', () => {
            const feil = lagFeil({
                regler: [{ id: 'UNDER_18_AAR', beskrivelse: 'Er under 18 år' }],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.erUnder18Aar).toBe(true);
            expect(result.kanAlleReglerOverstyres).toBe(true);
            expect(result.ansattManglerTilgang).toBe(false);
            expect(result.maaRegistreresIArenaFoerst).toBe(false);
            expect(result.regler).toEqual(['UNDER_18_AAR']);
        });

        it('UKJENT_ALDER → kanAlleReglerOverstyres=true', () => {
            const feil = lagFeil({
                regler: [{ id: 'UKJENT_ALDER', beskrivelse: 'Kan ikke fastslå alder' }],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(true);
            expect(result.erUnder18Aar).toBe(false);
        });

        it('IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN → kanAlleReglerOverstyres=true', () => {
            const feil = lagFeil({
                regler: [
                    {
                        id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN',
                        beskrivelse: 'Er ikke bosatt i Norge',
                    },
                ],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(true);
            expect(result.maaRegistreresIArenaFoerst).toBe(false);
        });

        it('ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT → kanAlleReglerOverstyres=true, maaRegistreresIArenaFoerst=true', () => {
            const feil = lagFeil({
                regler: [
                    {
                        id: 'ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT',
                        beskrivelse: 'EU/EØS ikke bosatt',
                    },
                ],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(true);
            expect(result.maaRegistreresIArenaFoerst).toBe(true);
        });

        it('kombinasjon av flere myke regler → kanAlleReglerOverstyres forblir true', () => {
            const feil = lagFeil({
                regler: [
                    {
                        id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN',
                        beskrivelse: 'Er ikke bosatt i Norge',
                    },
                    {
                        id: 'ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT',
                        beskrivelse: 'EU/EØS ikke bosatt',
                    },
                ],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(true);
            expect(result.maaRegistreresIArenaFoerst).toBe(true);
            expect(result.regler).toHaveLength(2);
        });
    });

    // -----------------------------------------------
    // Hard rules — cannot be overridden
    // -----------------------------------------------
    describe('harde regler (kan IKKE overstyres)', () => {
        it.each([
            ['DOED', 'Er registrert som død'] as const,
            ['SAVNET', 'Er registrert som savnet'] as const,
            ['IKKE_FUNNET', 'Person ikke funnet'] as const,
            ['UKJENT_REGEL', 'Ukjent regel'] as const,
        ])('%s → kanAlleReglerOverstyres=false', (regelId, beskrivelse) => {
            const feil = lagFeil({
                regler: [{ id: regelId, beskrivelse }],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(false);
            expect(result.regler).toEqual([regelId]);
        });

        it('ANSATT_IKKE_TILGANG_TIL_BRUKER → kanAlleReglerOverstyres=false, ansattManglerTilgang=true', () => {
            const feil = lagFeil({
                regler: [
                    {
                        id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER',
                        beskrivelse: 'Ansatt har ikke tilgang',
                    },
                ],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(false);
            expect(result.ansattManglerTilgang).toBe(true);
        });
    });

    // -----------------------------------------------
    // Access control — ansattManglerTilgang
    // -----------------------------------------------
    describe('ansattManglerTilgang', () => {
        it('manglende tilgang oppdages fra regel ANSATT_IKKE_TILGANG_TIL_BRUKER', () => {
            const feil = lagFeil({
                regler: [{ id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER', beskrivelse: '' }],
            });
            expect(klassifiserAvvisning(feil).ansattManglerTilgang).toBe(true);
        });

        it('manglende tilgang oppdages fra regel IKKE_TILGANG', () => {
            const feil = lagFeil({
                regler: [{ id: 'IKKE_TILGANG', beskrivelse: '' }],
            });
            expect(klassifiserAvvisning(feil).ansattManglerTilgang).toBe(true);
        });

        it('manglende tilgang oppdages fra feilKode IKKE_TILGANG (uten regler)', () => {
            const feil = lagFeil({
                feilKode: 'IKKE_TILGANG',
            });
            expect(klassifiserAvvisning(feil).ansattManglerTilgang).toBe(true);
        });

        it('er false når ingen tilgangsregel er tilstede', () => {
            const feil = lagFeil({
                regler: [{ id: 'DOED', beskrivelse: '' }],
            });
            expect(klassifiserAvvisning(feil).ansattManglerTilgang).toBe(false);
        });
    });

    // -----------------------------------------------
    // Mixed rules: soft + hard
    // -----------------------------------------------
    describe('blanding av myke og harde regler', () => {
        it('én hard regel blant myke → kanAlleReglerOverstyres=false (safe default)', () => {
            const feil = lagFeil({
                regler: [
                    { id: 'UNDER_18_AAR', beskrivelse: 'Under 18' },
                    { id: 'DOED', beskrivelse: 'Død' },
                ],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(false);
            expect(result.erUnder18Aar).toBe(true);
        });

        it('myk regel + tilgangsregel → kanAlleReglerOverstyres=false, ansattManglerTilgang=true', () => {
            const feil = lagFeil({
                regler: [
                    { id: 'UNDER_18_AAR', beskrivelse: '' },
                    { id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER', beskrivelse: '' },
                ],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(false);
            expect(result.ansattManglerTilgang).toBe(true);
            expect(result.erUnder18Aar).toBe(true);
        });
    });

    // -----------------------------------------------
    // Edge cases
    // -----------------------------------------------
    describe('edge cases', () => {
        it('feil uten aarsakTilAvvisning → tom regelarray, kanAlleReglerOverstyres=false', () => {
            const feil = lagFeil({ feilKode: 'UKJENT_FEIL' });
            const result = klassifiserAvvisning(feil);

            expect(result.regler).toEqual([]);
            expect(result.kanAlleReglerOverstyres).toBe(false);
            expect(result.ansattManglerTilgang).toBe(false);
            expect(result.erUnder18Aar).toBe(false);
            expect(result.maaRegistreresIArenaFoerst).toBe(false);
        });

        it('aarsakTilAvvisning med tom regelarray → kanAlleReglerOverstyres=false', () => {
            const feil: KanStartePeriodeFeil = {
                melding: 'Avvist',
                feilKode: 'AVVIST',
                aarsakTilAvvisning: { regler: [], detaljer: [] },
            };
            const result = klassifiserAvvisning(feil);

            expect(result.regler).toEqual([]);
            expect(result.kanAlleReglerOverstyres).toBe(false);
        });

        it('ukjent regelId (som ikke er i noen liste) → behandles som ikke-overstyrbar', () => {
            const feil = lagFeil({
                regler: [{ id: 'OPPHOERT_IDENTITET', beskrivelse: 'Opphørt identitet' }],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(false);
        });

        it('IKKE_TILGANG som feilKode + myke regler → ansattManglerTilgang=true', () => {
            const feil: KanStartePeriodeFeil = {
                melding: 'Ikke tilgang',
                feilKode: 'IKKE_TILGANG',
                aarsakTilAvvisning: {
                    regler: [{ id: 'UNDER_18_AAR', beskrivelse: 'Under 18' }],
                    detaljer: [],
                },
            };
            const result = klassifiserAvvisning(feil);

            expect(result.ansattManglerTilgang).toBe(true);
            expect(result.kanAlleReglerOverstyres).toBe(true);
            expect(result.erUnder18Aar).toBe(true);
        });

        it('alle fire myke regler samtidig → kanAlleReglerOverstyres=true, alle flagg settes korrekt', () => {
            const feil = lagFeil({
                regler: [
                    { id: 'UNDER_18_AAR', beskrivelse: '' },
                    { id: 'UKJENT_ALDER', beskrivelse: '' },
                    { id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN', beskrivelse: '' },
                    { id: 'ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT', beskrivelse: '' },
                ],
            });
            const result = klassifiserAvvisning(feil);

            expect(result.kanAlleReglerOverstyres).toBe(true);
            expect(result.erUnder18Aar).toBe(true);
            expect(result.maaRegistreresIArenaFoerst).toBe(true);
            expect(result.ansattManglerTilgang).toBe(false);
            expect(result.regler).toHaveLength(4);
        });
    });
});

// ═══════════════════════════════════════════════════
// Part 2: RegistreringSjekk — component / UI tests
// ═══════════════════════════════════════════════════

describe('RegistreringSjekk', () => {
    beforeEach(() => {
        replaceMock.mockClear();
    });

    // -----------------------------------------------
    // 204 OK → redirect
    // -----------------------------------------------
    describe('204 OK — redirect', () => {
        it('redirecter til /registrering-arbeidssoker når ok=true', async () => {
            await renderRegistreringSjekk(lagOkResult());

            expect(replaceMock).toHaveBeenCalledWith('/registrering-arbeidssoker');
        });

        it('rendrer ingenting (null) når ok=true', async () => {
            const { container } = await act(async () =>
                render(
                    <Suspense fallback={<div>Laster…</div>}>
                        <RegistreringSjekk kanStartePromise={Promise.resolve(lagOkResult())} />
                    </Suspense>,
                ),
            );

            expect(container.innerHTML).toBe('');
        });
    });

    // -----------------------------------------------
    // Fallback — no feil object
    // -----------------------------------------------
    describe('feilmelding uten feil-objekt (fallback)', () => {
        it('viser error-teksten direkte', async () => {
            await renderRegistreringSjekk(lagFallbackResult('Identitetsnummer mangler'));

            expect(screen.getByText('Identitetsnummer mangler')).toBeDefined();
        });
    });

    // -----------------------------------------------
    // Under 18 — special handling
    // -----------------------------------------------
    describe('UNDER_18_AAR — spesialhåndtering', () => {
        const under18Result = lagAvvistResult(
            lagFeil({
                regler: [{ id: 'UNDER_18_AAR', beskrivelse: 'Er under 18 år' }],
            }),
        );

        it('viser melding om samtykke fra foresatte', async () => {
            await renderRegistreringSjekk(under18Result);

            expect(screen.getByText(/under 18 år og trenger samtykke fra foresatte/)).toBeDefined();
        });

        it('viser lenke til servicerutine', async () => {
            await renderRegistreringSjekk(under18Result);

            expect(screen.getByText(/Servicerutine samtykke fra foresatte/)).toBeDefined();
        });

        it('viser vurderingskriterier-seksjonen (myke regler kan overstyres)', async () => {
            await renderRegistreringSjekk(under18Result);

            expect(screen.getByText(/samtykke fra foresatte for å kunne registrere mindreårige/)).toBeDefined();
        });

        it('viser registreringsknapp med overstyring', async () => {
            await renderRegistreringSjekk(under18Result);

            expect(screen.getByText('Registrer som arbeidssøker')).toBeDefined();
        });

        it('registreringsknappen er disabled før checkbox er bekreftet', async () => {
            await renderRegistreringSjekk(under18Result);

            const button = screen.getByRole('button', { name: 'Registrer som arbeidssøker' });
            expect(button).toHaveProperty('disabled', true);
        });
    });

    // -----------------------------------------------
    // Soft rules — can be overridden
    // -----------------------------------------------
    describe('myke regler — kan overstyres av veileder', () => {
        it('UKJENT_ALDER → viser "vurdering er gjort"-melding og registreringsknapp', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'UKJENT_ALDER', beskrivelse: 'Kan ikke fastslå alder' }],
                    }),
                ),
            );

            expect(
                screen.getByText('Personen må registreres av en veileder etter at en vurdering er gjort'),
            ).toBeDefined();
            expect(screen.getByText('Registrer som arbeidssøker')).toBeDefined();
            expect(screen.getByText(/Systemene vår kan ikke bekrefte personens alder/)).toBeDefined();
        });

        it('IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN → viser adressevarsel', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [
                            {
                                id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN',
                                beskrivelse: 'Er ikke bosatt i Norge i henhold til folkeregisterloven',
                            },
                        ],
                    }),
                ),
            );

            expect(
                screen.getByText('Personen må registreres av en veileder etter at en vurdering er gjort'),
            ).toBeDefined();
            expect(screen.getByText(/Adressene vi finner i våre systemer oppfyller ikke kravene/)).toBeDefined();
        });

        it('ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT → viser Arena-instruksjoner', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [
                            {
                                id: 'ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT',
                                beskrivelse: 'Er EU/EØS-statsborger med status ikke bosatt',
                            },
                        ],
                    }),
                ),
            );

            // Arena-instruksjoner
            expect(screen.getByText('Trenger personen å være registrert i Arena?')).toBeDefined();
            expect(screen.getByText('Sjekk om personen allerede ligger i Arena')).toBeDefined();
            expect(
                screen.getByText(/Registrer personen i Arena hvis hen ikke allerede er registrert der/),
            ).toBeDefined();
            expect(screen.getByText('Registrer personen som arbeidssøker')).toBeDefined();

            // Also has override button
            expect(screen.getByRole('button', { name: 'Registrer som arbeidssøker' })).toBeDefined();
        });

        it('myke regler viser IKKE "Hva må ordnes"-seksjonen', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'UKJENT_ALDER', beskrivelse: 'Kan ikke fastslå alder' }],
                    }),
                ),
            );

            expect(screen.queryByText('Hva må ordnes før personen kan registreres?')).toBeNull();
            expect(screen.queryByText('Hva må ordnes før du kan registrere personen?')).toBeNull();
        });

        it('kombinasjon av flere myke regler → viser alle tiltak', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [
                            {
                                id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN',
                                beskrivelse: 'Er ikke bosatt i Norge',
                            },
                            {
                                id: 'ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT',
                                beskrivelse: 'EU/EØS ikke bosatt',
                            },
                        ],
                    }),
                ),
            );

            // Both tiltak visible
            expect(screen.getByText(/Adressene vi finner i våre systemer/)).toBeDefined();
            expect(screen.getByText(/Personen står som utflyttet i registerene/)).toBeDefined();

            // Arena instructions visible
            expect(screen.getByText('Trenger personen å være registrert i Arena?')).toBeDefined();
        });

        it('myke regler viser Gosys-instruks', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'UKJENT_ALDER', beskrivelse: 'Kan ikke fastslå alder' }],
                    }),
                ),
            );

            expect(screen.getByText(/Du må opprette et notat og dokumentere vurderingene i Gosys/)).toBeDefined();
        });
    });

    // -----------------------------------------------
    // Hard rules — cannot be overridden
    // -----------------------------------------------
    describe('harde regler — kan IKKE overstyres', () => {
        it('DOED → viser blokkerende melding og tiltak', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'DOED', beskrivelse: 'Er registrert som død i folkeregisteret' }],
                    }),
                ),
            );

            expect(screen.getByText('Du kan ikke registrere denne personen som arbeidssøker')).toBeDefined();
            expect(screen.getByText('Hva må ordnes før personen kan registreres?')).toBeDefined();
            expect(screen.getByText(/Sjekk at du har tastet inn korrekt personident/)).toBeDefined();
        });

        it('DOED → viser IKKE registreringsknapp', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'DOED', beskrivelse: '' }],
                    }),
                ),
            );

            expect(screen.queryByRole('button', { name: 'Registrer som arbeidssøker' })).toBeNull();
        });

        it('SAVNET → viser blokkerende melding med folkeregister-lenker', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'SAVNET', beskrivelse: 'Er registrert som savnet' }],
                    }),
                ),
            );

            expect(screen.getByText('Du kan ikke registrere denne personen som arbeidssøker')).toBeDefined();
            expect(screen.getByText(/Personen kan selv kontakte folkeregisteret/)).toBeDefined();
        });

        it('IKKE_FUNNET → viser blokkerende melding', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'IKKE_FUNNET', beskrivelse: 'Person ikke funnet' }],
                    }),
                ),
            );

            expect(screen.getByText('Du kan ikke registrere denne personen som arbeidssøker')).toBeDefined();
            expect(screen.getByText('Hva må ordnes før personen kan registreres?')).toBeDefined();
        });

        it('harde regler viser IKKE vurderingskriterier eller Gosys-instruksjoner', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'DOED', beskrivelse: '' }],
                    }),
                ),
            );

            expect(screen.queryByText(/Hvorfor må jeg gjøre en vurdering/)).toBeNull();
            expect(screen.queryByText(/dokumentere vurderingene i Gosys/)).toBeNull();
        });

        it('harde regler viser IKKE Arena-instruksjoner', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'DOED', beskrivelse: '' }],
                    }),
                ),
            );

            expect(screen.queryByText('Trenger personen å være registrert i Arena?')).toBeNull();
        });
    });

    // -----------------------------------------------
    // Access control
    // -----------------------------------------------
    describe('tilgangsfeil — ansatt mangler tilgang', () => {
        it('ANSATT_IKKE_TILGANG_TIL_BRUKER → viser tilgangsmelding', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [
                            {
                                id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER',
                                beskrivelse: 'Ansatt har ikke tilgang til bruker',
                            },
                        ],
                    }),
                ),
            );

            expect(screen.getByText('Du kan ikke registrere denne personen som arbeidssøker')).toBeDefined();
            expect(screen.getByText('Hva må ordnes før du kan registrere personen?')).toBeDefined();
            expect(screen.getByText(/Du må få korrekt tilgang til vedkommende/)).toBeDefined();
            expect(screen.getByText(/Ta kontakt med din lokale identansvarlig/)).toBeDefined();
        });

        it('ANSATT_IKKE_TILGANG_TIL_BRUKER → viser IKKE registreringsknapp', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [
                            {
                                id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER',
                                beskrivelse: 'Ansatt har ikke tilgang',
                            },
                        ],
                    }),
                ),
            );

            expect(screen.queryByRole('button', { name: 'Registrer som arbeidssøker' })).toBeNull();
        });

        it('IKKE_TILGANG feilKode med IKKE_TILGANG-regel → viser tilgangsmelding', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        feilKode: 'IKKE_TILGANG',
                        regler: [{ id: 'IKKE_TILGANG', beskrivelse: 'Ikke tilgang' }],
                    }),
                ),
            );

            expect(screen.getByText('Du kan ikke registrere denne personen som arbeidssøker')).toBeDefined();
        });
    });

    // -----------------------------------------------
    // Generic server errors
    // -----------------------------------------------
    describe('generiske feil (feil-objekt uten regler)', () => {
        it('UKJENT_FEIL uten aarsakTilAvvisning → viser Alert med "Du kan ikke registrere…"', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        melding: 'En ukjent feil har oppstått',
                        feilKode: 'UKJENT_FEIL',
                    }),
                ),
            );

            expect(screen.getByText('Du kan ikke registrere denne personen som arbeidssøker')).toBeDefined();
        });

        it('UVENTET_FEIL_MOT_EKSTERN_TJENESTE → viser feilmelding', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        melding: 'Uventet feil mot ekstern tjeneste',
                        feilKode: 'UVENTET_FEIL_MOT_EKSTERN_TJENESTE',
                    }),
                ),
            );

            // feil-objekt exists but no regler → kanAlleReglerOverstyres=false
            expect(screen.getByText('Du kan ikke registrere denne personen som arbeidssøker')).toBeDefined();
        });
    });

    // -----------------------------------------------
    // Alert visibility per regel
    // -----------------------------------------------
    describe('regelbeskrivelser vises i Alert-listen', () => {
        it('viser alle regelbeskrivelser fra aarsakTilAvvisning', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [
                            {
                                id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN',
                                beskrivelse: 'Er ikke bosatt i Norge i henhold til folkeregisterloven',
                            },
                            {
                                id: 'ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT',
                                beskrivelse: 'Er EU/EØS-statsborger med status ikke bosatt',
                            },
                        ],
                    }),
                ),
            );

            expect(screen.getByText('Er ikke bosatt i Norge i henhold til folkeregisterloven')).toBeDefined();
            expect(screen.getByText('Er EU/EØS-statsborger med status ikke bosatt')).toBeDefined();
        });
    });

    // -----------------------------------------------
    // "Mener du dette er feil?" ReadMore
    // -----------------------------------------------
    describe('"Mener du dette er feil?" — ReadMore', () => {
        it('viser ReadMore med tekst "Mener du dette er feil?" for avvisninger', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'DOED', beskrivelse: 'Er død' }],
                    }),
                ),
            );

            expect(screen.getByText('Mener du dette er feil?')).toBeDefined();
        });
    });

    // -----------------------------------------------
    // Checkbox / override flow
    // -----------------------------------------------
    describe('overstyringsflyt med checkbox', () => {
        it('checkbox er synlig for myke regler', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'UKJENT_ALDER', beskrivelse: 'Ukjent alder' }],
                    }),
                ),
            );

            expect(
                screen.getByText(/Jeg bekrefter at de nødvendige vurderingene er gjort og dokumentert/),
            ).toBeDefined();
        });

        it('checkbox er IKKE synlig for harde regler', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'DOED', beskrivelse: '' }],
                    }),
                ),
            );

            expect(
                screen.queryByText(/Jeg bekrefter at de nødvendige vurderingene er gjort og dokumentert/),
            ).toBeNull();
        });
    });

    // -----------------------------------------------
    // Mutual exclusivity of sections
    // -----------------------------------------------
    describe('gjensidig utelukkelse av seksjoner', () => {
        it('myke regler → viser VurderingskriterierForArbeidssoekerregistrering, IKKE AarsakerTilAtPersonenIkkeKanRegistreres', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'UKJENT_ALDER', beskrivelse: '' }],
                    }),
                ),
            );

            expect(screen.getByText(/Hvorfor må jeg gjøre en vurdering/)).toBeDefined();
            expect(screen.queryByText('Hva må ordnes før personen kan registreres?')).toBeNull();
        });

        it('harde regler → viser AarsakerTilAtPersonenIkkeKanRegistreres, IKKE VurderingskriterierForArbeidssoekerregistrering', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'SAVNET', beskrivelse: '' }],
                    }),
                ),
            );

            expect(screen.getByText('Hva må ordnes før personen kan registreres?')).toBeDefined();
            expect(screen.queryByText(/Hvorfor må jeg gjøre en vurdering/)).toBeNull();
        });

        it('Arena-instruksjoner vises BARE for ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT', async () => {
            // Other soft rule should NOT show Arena instructions
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        regler: [{ id: 'UNDER_18_AAR', beskrivelse: '' }],
                    }),
                ),
            );

            expect(screen.queryByText('Trenger personen å være registrert i Arena?')).toBeNull();
        });
    });

    // -----------------------------------------------
    // Regression: IKKE_TILGANG feilKode without regler
    // should not show override controls
    // -----------------------------------------------
    describe('regresjonstest: feilKode IKKE_TILGANG uten regler', () => {
        it('viser blokkerende melding uten overstyring', async () => {
            await renderRegistreringSjekk(
                lagAvvistResult(
                    lagFeil({
                        melding: 'Du har ikke tilgang',
                        feilKode: 'IKKE_TILGANG',
                    }),
                ),
            );

            // kanAlleReglerOverstyres = false (empty regler array)
            // ansattManglerTilgang = true (from feilKode)
            // → shows hard block, no override
            expect(screen.getByText('Du kan ikke registrere denne personen som arbeidssøker')).toBeDefined();
            expect(screen.queryByRole('button', { name: 'Registrer som arbeidssøker' })).toBeNull();
            expect(screen.queryByText(/Jeg bekrefter at de nødvendige vurderingene er gjort/)).toBeNull();
        });
    });
});
