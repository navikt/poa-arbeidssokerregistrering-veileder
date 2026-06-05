import type { Meta, StoryObj } from '@storybook/nextjs';
import { Suspense } from 'react';
import { ModiaProvider } from '@/contexts/modia-context';
import type { OversiktenApiResult, OversiktType } from '@/lib/api/oversikten';
import oversiktenMock from '@/lib/mocks/oversikten.json';
import { Oversikten } from './Oversikten';

const alleBrukere = oversiktenMock as OversiktType[];

const fåBrukere: OversiktType[] = alleBrukere.slice(0, 4);

const kunKritiskeBrukere: OversiktType[] = [
    {
        id: 101,
        navn: 'Silje Langvarig',
        dagerLedig: 200,
        bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
        onskerVeileder: { svar: true, dato: '2026-01-15' },
        rapportertArbeid: { svar: false, dato: '2026-05-10' },
    },
    {
        id: 102,
        navn: 'Erik Over Grensen',
        dagerLedig: 250,
        bekreftelsesloesning: 'DAGPENGER',
        onskerVeileder: { svar: false, dato: '2026-02-01' },
        rapportertArbeid: { svar: false, dato: '2026-05-12' },
    },
    {
        id: 103,
        navn: 'Marte Veldig Lang',
        dagerLedig: 182,
        bekreftelsesloesning: 'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
        onskerVeileder: { svar: true, dato: '2026-02-20' },
        rapportertArbeid: { svar: false, dato: '2026-05-08' },
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
        result: { oversikt: alleBrukere },
    },
};

export const MedFåBrukere: Story = {
    name: 'Med få brukere (ingen paginering)',
    args: {
        result: { oversikt: fåBrukere },
    },
};

export const TomListe: Story = {
    name: 'Tom liste (ingen arbeidssøkere)',
    args: {
        result: { oversikt: [] },
    },
};

export const ManglerTilgang: Story = {
    name: 'Mangler tilgang (ingen enhet valgt)',
    args: {
        result: { oversikt: null, manglerTilgang: true },
    },
};

export const Feil: Story = {
    name: 'Feil ved henting av data',
    args: {
        result: { oversikt: null, error: new Error('Feil ved henting av oversikt') },
    },
};

export const KunKritiskeBrukere: Story = {
    name: 'Kun kritiske brukere (≥180 dager ledig)',
    args: {
        result: { oversikt: kunKritiskeBrukere },
    },
};
