import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { VisningsTypeProvider } from '@/app/contexts/hendelse-visning-context';
import { ModiaProvider } from '@/app/contexts/modia-context';
import perioderMock from '@/app/mocks/perioder.json';
import { samplePeriode } from './__mocks__/tidslinje-mock-data';
import { Historikk } from './Historikk';

const meta = {
    title: 'Historikk/Historikk siden',
    component: Historikk,
    decorators: [
        (Story) => (
            <VisningsTypeProvider>
                <ModiaProvider initFnr='12345678901' initEnhetId='9999'>
                    <div className='max-w-6xl mx-auto p-4'>
                        <Story />
                    </div>
                </ModiaProvider>
            </VisningsTypeProvider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Viser hele historikk siden. Historikk Med Data viser en side med perioder, Historikk Uten Data viser fallback når ingen perioder finnes.',
            },
        },
    },
} satisfies Meta<typeof Historikk>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HistorikkMedData: Story = {
    args: {
        perioderPromise: Promise.resolve({
            perioder: perioderMock as Periode[],
        }),
    },
};

export const HistorikkMedEnPeriode: Story = {
    args: {
        perioderPromise: Promise.resolve({
            perioder: [samplePeriode],
        }),
    },
};

export const HistorikkUtenData: Story = {
    args: {
        perioderPromise: Promise.resolve({
            perioder: [],
        }),
    },
};

export const HistorikkMedFeil: Story = {
    args: {
        perioderPromise: Promise.resolve({
            perioder: null,
            error: new Error('Noe gikk galt'),
        }),
    },
};
