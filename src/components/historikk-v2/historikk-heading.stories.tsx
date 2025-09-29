import type { Meta, StoryObj } from '@storybook/nextjs';

import { HistorikkHeading } from './historikk-heading';
import { ParamsFromContextProvider } from '../../contexts/params-from-context';
import { avsluttetTidslinje, sampleTidslinje } from './__mocks__/tidslinje-mock-data';

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
        tidslinje: {
            ...sampleTidslinje,
            ...avsluttetTidslinje,
        },
    },
};
