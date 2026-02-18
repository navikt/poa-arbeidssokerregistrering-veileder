import type { Meta, StoryObj } from '@storybook/nextjs';
import { FilterProvider } from '../../contexts/filter-hendelse-context';
import { samplePeriode } from './__mocks__/tidslinje-mock-data';
import { HistorikkPeriode } from './HistorikkPeriode';

const meta = {
    title: 'Historikk/Historikk',
    component: HistorikkPeriode,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <FilterProvider>
                <div className="max-w-4xl mx-auto p-4">
                    <Story />
                </div>
            </FilterProvider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof HistorikkPeriode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Periode: Story = {
    args: {
        periode: samplePeriode,
    },
};
