import type { Meta, StoryObj } from '@storybook/nextjs';
import { Suspense } from 'react';
import { ModiaProvider } from '@/contexts/modia-context';
import type { OversiktenApiResult } from '@/lib/api/oversikten';
import oversiktenMock from '@/lib/mocks/oversikten.json';
import type { Arbeidssoker, OversiktApiResponse } from '@/model/oversikt-api';
import { Oversikten } from './Oversikten';

const typedMock = oversiktenMock as unknown as OversiktApiResponse;
const alleBrukere = typedMock.arbeidssoekere;
const fåBrukere = alleBrukere.slice(0, 4);

const kunKritiskeBrukere: Arbeidssoker[] = [
    {
        arbeidssoeker_id: 101,
        identitetsnummer: '12345678901',
        fornavn: 'SILJE',
        etternavn: 'LANGVARIG',
        ledig_siden: '2025-12-23T00:00:00Z',
        periode: { id: 'per-101', startet: '2025-12-23T00:00:00Z' },
        bekreftelse_paa_vegne_av: ['ARBEIDSSOEKERREGISTERET'],
        tilknyttet_kontor: [],
    },
    {
        arbeidssoeker_id: 102,
        identitetsnummer: '12345678902',
        fornavn: 'ERIK',
        etternavn: 'OVER GRENSEN',
        ledig_siden: '2025-10-04T00:00:00Z',
        periode: { id: 'per-102', startet: '2025-10-04T00:00:00Z' },
        bekreftelse_paa_vegne_av: ['DAGPENGER'],
        tilknyttet_kontor: [],
    },
    {
        arbeidssoeker_id: 103,
        identitetsnummer: '12345678903',
        fornavn: 'MARTE',
        etternavn: 'VELDIG LANG',
        ledig_siden: '2025-12-12T00:00:00Z',
        periode: { id: 'per-103', startet: '2025-12-12T00:00:00Z' },
        bekreftelse_paa_vegne_av: ['FRISKMELDT_TIL_ARBEIDSFORMIDLING'],
        tilknyttet_kontor: [],
    },
];

/**
 * Wrapper som konverterer plain OversiktenApiResult til Promise for Storybook-stories.
 * Unngår at Promise-objektet hamner i Storybook args (og dermed JSON-serialisering),
 * som elles gir sirkulær referanse-feil med React.
 */
function OversiktenPreview({ result }: { result: OversiktenApiResult }) {
    return (
        <Suspense>
            <Oversikten oversiktenPromise={Promise.resolve(result)} />
        </Suspense>
    );
}

const meta = {
    title: 'Forside/Oversikten',
    component: OversiktenPreview,
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
                    'Oversikt over arbeidssøkere på enheten. Viser tabell med filtrering, sortering og paginering. Bruker dager-ledig-tags for å markere langtidsledige.',
            },
        },
    },
} satisfies Meta<typeof OversiktenPreview>;

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
        result: { arbeidssoekere: [], error: new Error('Feil ved henting av oversikt') },
    },
};

export const KunKritiskeBrukere: Story = {
    name: 'Kun kritiske brukere (≥180 dager ledig)',
    args: {
        result: { arbeidssoekere: kunKritiskeBrukere },
    },
};
