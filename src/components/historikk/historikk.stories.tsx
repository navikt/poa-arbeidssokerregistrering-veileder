import type { Meta, StoryObj } from '@storybook/nextjs';
import { ParamsFromContextProvider } from '../../contexts/params-from-context';
import { TidslinjeSelectionProvider } from '../../contexts/tidslinje-selection-context';
import { samplePeriode } from './__mocks__/tidslinje-mock-data';
import { Historikk } from './historikk';
import { FilterProvider } from '../../contexts/hendelse-context';

const meta = {
    title: 'Historikk/Historikk',
    component: Historikk,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ParamsFromContextProvider>
                <TidslinjeSelectionProvider>
                    <FilterProvider>
                        <div className="max-w-4xl mx-auto p-4">
                            <Story />
                        </div>
                    </FilterProvider>
                </TidslinjeSelectionProvider>
            </ParamsFromContextProvider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Historikk>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Periode: Story = {
    args: {
        periode: samplePeriode,
    },
};
