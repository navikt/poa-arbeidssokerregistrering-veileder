import type { Meta, StoryObj } from '@storybook/nextjs';
import { Suspense } from 'react';
import type { KanStartePeriodeFeil, KanStartePeriodeResult } from '@/model/kan-starte-periode';
import { RegistreringSjekk } from './RegistreringSjekk';

function avvistResult(feil: KanStartePeriodeFeil): KanStartePeriodeResult {
    return { ok: false, error: feil.melding, feil };
}

/**
 * Wrapper-type for stories.
 *
 * Storybook Controls can't display a Promise, so we expose the raw
 * `KanStartePeriodeResult` as `apiResponse` and convert it to a
 * Promise in the `render` function.
 */
type RegistreringSjekkStoryProps = {
    /** Resultatet fra PUT /api/v2/arbeidssoker/kanStartePeriode. 204 gir `{ ok: true }`, alt annet gir `{ ok: false, error, feil? }`. */
    apiResponse: KanStartePeriodeResult;
};

const meta = {
    title: 'RegistreringSjekk/Avvisninger',
    decorators: [
        (Story) => (
            <div className='max-w-3xl mx-auto p-4'>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        nextjs: {
            appDirectory: true,
            navigation: {
                push: () => {},
                replace: () => {},
            },
        },
        docs: {
            description: {
                component: [
                    'Viser avvisningsscenarier for arbeidssøkerregistrering.',
                    '',
                    '**API:** `PUT /api/v2/arbeidssoker/kanStartePeriode`',
                    '',
                    '- **204 No Content** → personen kan registreres (`{ ok: true }`).',
                    '- **Alle andre statuskoder** → avvisning (`{ ok: false, error, feil? }`).',
                    '',
                    'Se `apiResponse` i Controls-fanen for å se og endre API-responsen som driver visningen.',
                    '',
                    '`feil` følger `FeilV2`-skjemaet fra [OpenAPI-spesifikasjonen](https://github.com/navikt/paw-arbeidssoekerregisteret-monorepo-intern/blob/main/apps/api-start-stopp-perioder/src/main/resources/openapi/startstopp.yaml).',
                ].join('\n'),
            },
        },
    },
    argTypes: {
        apiResponse: {
            description: [
                'Resultatet fra `PUT /api/v2/arbeidssoker/kanStartePeriode`.',
                '',
                '**Struktur (`FeilV2`):**',
                '```json',
                '{',
                '  "ok": false,',
                '  "error": "string",',
                '  "feil": {',
                '    "melding": "string",',
                '    "feilKode": "UKJENT_FEIL | UVENTET_FEIL_MOT_EKSTERN_TJENESTE | FEIL_VED_LESING_AV_FORESPORSEL | AVVIST | IKKE_TILGANG",',
                '    "aarsakTilAvvisning": {',
                '      "regler": [{ "id": "ApiRegelId", "beskrivelse": "string" }],',
                '      "detaljer": ["Opplysning"]',
                '    }',
                '  }',
                '}',
                '```',
                '',
                '**ApiRegelId:** `UKJENT_REGEL`, `IKKE_FUNNET`, `SAVNET`, `DOED`, `OPPHOERT_IDENTITET`, `ENDRE_FOR_ANNEN_BRUKER`, `ANSATT_IKKE_TILGANG_TIL_BRUKER`, `IKKE_TILGANG`, `UNDER_18_AAR`, `IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN`, `ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT`, `UKJENT_ALDER`',
            ].join('\n'),
            control: { type: 'object' },
        },
    },
    render: ({ apiResponse }) => (
        <Suspense fallback={<div>Laster…</div>}>
            <RegistreringSjekk kanStartePromise={Promise.resolve(apiResponse)} />
        </Suspense>
    ),
} satisfies Meta<RegistreringSjekkStoryProps>;

export default meta;
type Story = StoryObj<RegistreringSjekkStoryProps>;

// ---------------------------------------------------------------------------
//  Myke regler (kan overstyres av veileder)
// ---------------------------------------------------------------------------

export const Under18Aar: Story = {
    name: 'Under 18 år (samtykke fra foresatte)',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [{ id: 'UNDER_18_AAR', beskrivelse: 'Er under 18 år' }],
                detaljer: ['ER_UNDER_18_AAR', 'HAR_NORSK_ADRESSE', 'ANSATT_TILGANG'],
            },
        }),
    },
};

export const UkjentAlder: Story = {
    name: 'Ukjent alder (kan overstyres)',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [{ id: 'UKJENT_ALDER', beskrivelse: 'Kan ikke fastslå alder' }],
                detaljer: ['UKJENT_FOEDSELSDATO', 'HAR_NORSK_ADRESSE', 'ANSATT_TILGANG'],
            },
        }),
    },
};

export const IkkeBosatt: Story = {
    name: 'Ikke bosatt i Norge (kan overstyres)',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [
                    {
                        id: 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN',
                        beskrivelse: 'Er ikke bosatt i Norge i henhold til folkeregisterloven',
                    },
                ],
                detaljer: ['IKKE_BOSATT', 'HAR_UTENLANDSK_ADRESSE', 'ANSATT_TILGANG'],
            },
        }),
    },
};

export const EuEoesIkkeBosatt: Story = {
    name: 'EU/EØS-statsborger ikke bosatt (Arena-instruksjoner)',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [
                    {
                        id: 'ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT',
                        beskrivelse: 'Er EU/EØS-statsborger med status ikke bosatt',
                    },
                ],
                detaljer: ['ER_EU_EOES_STATSBORGER', 'IKKE_BOSATT', 'SISTE_FLYTTING_VAR_UT_AV_NORGE', 'ANSATT_TILGANG'],
            },
        }),
    },
};

export const FlereMykeRegler: Story = {
    name: 'Flere myke regler kombinert (kan overstyres)',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
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
                detaljer: [
                    'ER_EU_EOES_STATSBORGER',
                    'IKKE_BOSATT',
                    'SISTE_FLYTTING_VAR_UT_AV_NORGE',
                    'HAR_UTENLANDSK_ADRESSE',
                    'ANSATT_TILGANG',
                ],
            },
        }),
    },
};

// ---------------------------------------------------------------------------
//  Harde regler (kan IKKE overstyres)
// ---------------------------------------------------------------------------

export const PersonErDoed: Story = {
    name: 'Person er død (hard blokkering)',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [{ id: 'DOED', beskrivelse: 'Er registrert som død i folkeregisteret' }],
                detaljer: ['DOED', 'ANSATT_TILGANG'],
            },
        }),
    },
};

export const PersonErSavnet: Story = {
    name: 'Person er savnet (hard blokkering)',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [{ id: 'SAVNET', beskrivelse: 'Er registrert som savnet i folkeregisteret' }],
                detaljer: ['SAVNET', 'ANSATT_TILGANG'],
            },
        }),
    },
};

export const PersonIkkeFunnet: Story = {
    name: 'Person ikke funnet (hard blokkering)',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [{ id: 'IKKE_FUNNET', beskrivelse: 'Person ikke funnet i folkeregisteret' }],
                detaljer: ['PERSON_IKKE_FUNNET', 'ANSATT_TILGANG'],
            },
        }),
    },
};

// ---------------------------------------------------------------------------
//  Tilgangsfeil
// ---------------------------------------------------------------------------

export const AnsattManglerTilgang: Story = {
    name: 'Ansatt mangler tilgang til bruker',
    args: {
        apiResponse: avvistResult({
            melding: "Avvist, se 'aarsakTilAvvisning' for detaljer",
            feilKode: 'AVVIST',
            aarsakTilAvvisning: {
                regler: [
                    {
                        id: 'ANSATT_IKKE_TILGANG_TIL_BRUKER',
                        beskrivelse: 'Ansatt har ikke tilgang til bruker',
                    },
                ],
                detaljer: ['ANSATT_IKKE_TILGANG'],
            },
        }),
    },
};

export const IkkeTilgangFeilKode: Story = {
    name: 'IKKE_TILGANG feilKode (feilKode-nivå tilgangsfeil)',
    args: {
        apiResponse: avvistResult({
            melding: 'Du har ikke tilgang',
            feilKode: 'IKKE_TILGANG',
            aarsakTilAvvisning: {
                regler: [{ id: 'IKKE_TILGANG', beskrivelse: 'Ikke tilgang' }],
                detaljer: ['ANSATT_IKKE_TILGANG'],
            },
        }),
    },
};

// ---------------------------------------------------------------------------
//  Generiske feil
// ---------------------------------------------------------------------------

export const UkjentFeil: Story = {
    name: 'Ukjent feil fra server',
    args: {
        apiResponse: avvistResult({
            melding: 'En ukjent feil har oppstått',
            feilKode: 'UKJENT_FEIL',
        }),
    },
};

export const UventetFeilMotEksternTjeneste: Story = {
    name: 'Uventet feil mot ekstern tjeneste',
    args: {
        apiResponse: avvistResult({
            melding: 'Uventet feil mot ekstern tjeneste',
            feilKode: 'UVENTET_FEIL_MOT_EKSTERN_TJENESTE',
        }),
    },
};

export const FeilVedLesingAvForesporsel: Story = {
    name: 'Feil ved lesing av forespørsel',
    args: {
        apiResponse: avvistResult({
            melding: 'Kunne ikke lese forespørselen',
            feilKode: 'FEIL_VED_LESING_AV_FORESPORSEL',
        }),
    },
};

// ---------------------------------------------------------------------------
//  Fallback (ingen feil-objekt fra API)
// ---------------------------------------------------------------------------

export const PlainErrorUtenFeilObjekt: Story = {
    name: 'Feilmelding uten feil-objekt (fallback)',
    args: {
        apiResponse: {
            ok: false,
            error: 'Identitetsnummer mangler',
        },
    },
};

export const ApiUrlMangler: Story = {
    name: 'API URL mangler i konfigurasjon (fallback)',
    args: {
        apiResponse: {
            ok: false,
            error: 'API URL mangler i konfigurasjon',
        },
    },
};
