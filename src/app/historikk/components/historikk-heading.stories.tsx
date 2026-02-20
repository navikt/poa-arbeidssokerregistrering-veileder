import type { Meta, StoryObj } from '@storybook/nextjs';
import { ParamsFromContextProvider } from '../../../contexts/params-from-context';
import { samplePeriode } from './__mocks__/tidslinje-mock-data';
import { HistorikkHeading } from './HistorikkHeading';

const meta = {
    title: 'Historikk/Historikk Heading',
    component: HistorikkHeading,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ParamsFromContextProvider>
                <Story />
            </ParamsFromContextProvider>
        ),
    ],
} satisfies Meta<typeof HistorikkHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        periode: {
            ...samplePeriode,
        },
    },
};
