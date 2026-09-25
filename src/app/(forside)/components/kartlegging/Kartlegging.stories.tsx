import type { Meta, StoryObj } from '@storybook/nextjs';
import { Suspense } from 'react';
import { Kartlegging } from '@/app/(forside)/components/kartlegging';
import { ModiaProvider } from '@/contexts/modia-context';
import type { KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import kartleggingMock from '@/lib/mocks/kartlegging-kompakt.json';
import type { ArbeidssokerKompakt, KartleggingApiKompaktResponse } from '@/model/kartlegging-api';

const typedMock = kartleggingMock as unknown as KartleggingApiKompaktResponse;
const alleBrukere = typedMock.arbeidssoekere;
const fåBrukere = alleBrukere.slice(0, 4);

const kunKritiskeBrukere: ArbeidssokerKompakt[] = [
    {
        id: 101,
        aktorId: '101',
        identitetsnummer: '12345678901',
        fornavn: 'SILJE',
        etternavn: 'LANGVARIG',
        ledighetsperioder: [
            {
                periodeStartet: '2025-12-23T00:00:00Z',
                ledigSiden: '2025-12-23T00:00:00Z',
                bekreftelseAnsvar: ['ARBEIDSSOEKERREGISTERET'],
            },
        ],
        kontortilknytninger: [],
    },
    {
        id: 102,
        aktorId: '102',
        identitetsnummer: '12345678902',
        fornavn: 'ERIK',
        etternavn: 'OVER GRENSEN',
        ledighetsperioder: [
            {
                periodeStartet: '2025-10-04T00:00:00Z',
                ledigSiden: '2025-10-04T00:00:00Z',
                bekreftelseAnsvar: ['DAGPENGER'],
            },
        ],
        kontortilknytninger: [],
    },
    {
        id: 103,
        aktorId: '103',
        identitetsnummer: '12345678903',
        fornavn: 'MARTE',
        etternavn: 'VELDIG LANG',
        ledighetsperioder: [
            {
                periodeStartet: '2025-12-12T00:00:00Z',
                ledigSiden: '2025-12-12T00:00:00Z',
                bekreftelseAnsvar: ['FRISKMELDT_TIL_ARBEIDSFORMIDLING'],
            },
        ],
        kontortilknytninger: [],
    },
];

/**
 * Wrapper som konverterer plain KartleggingApiKompaktResult til Promise for Storybook-stories.
 * Unngår at Promise-objektet hamner i Storybook args (og dermed JSON-serialisering),
 * som elles gir sirkulær referanse-feil med React.
 */
function KartleggingPreview({ result }: { result: KartleggingApiKompaktResult }) {
    return (
        <Suspense>
            <Kartlegging kartleggingPromise={Promise.resolve(result)} />
        </Suspense>
    );
}

const meta = {
    title: 'Forside/Kartlegging',
    component: KartleggingPreview,
    decorators: [
        (Story) => (
            <ModiaProvider initFnr={null} initEnhetId='9999'>
                <div className='max-w-5xl mx-auto p-4'>
                    <Story />
                </div>
            </ModiaProvider>
        ),
    ],
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Kartlegging av arbeidssøkere på enheten. Viser tabell med filtrering, sortering og paginering. Bruker dager-ledig-tags for å markere langtidsledige.',
            },
        },
    },
} satisfies Meta<typeof KartleggingPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MedMangeBrukere: Story = {
    name: 'Med mange brukere (paginering)',
    args: {
        result: { arbeidssoekere: alleBrukere },
    },
};

export const MedFåBrukere: Story = {
    name: 'Med få brukere (ingen paginering)',
    args: {
        result: { arbeidssoekere: fåBrukere },
    },
};

export const TomListe: Story = {
    name: 'Tom liste (ingen arbeidssøkere)',
    args: {
        result: { arbeidssoekere: [] },
    },
};

export const ManglerTilgang: Story = {
    name: 'Mangler tilgang (ingen enhet valgt)',
    args: {
        result: { arbeidssoekere: [], manglerTilgang: true },
    },
};

export const Feil: Story = {
    name: 'Feil ved henting av data',
    args: {
        result: { arbeidssoekere: [], error: new Error('Feil ved henting av kartlegging') },
    },
};

export const KunKritiskeBrukere: Story = {
    name: 'Kun kritiske brukere (≥180 dager ledig)',
    args: {
        result: { arbeidssoekere: kunKritiskeBrukere },
    },
};
