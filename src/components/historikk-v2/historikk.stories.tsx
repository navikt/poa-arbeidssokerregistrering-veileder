import type { Meta, StoryObj } from '@storybook/nextjs';
import { ParamsFromContextProvider } from '../../contexts/params-from-context';
import { TidslinjeSelectionProvider } from '../../contexts/tidslinje-selection-context';
import {
    avsluttetTidslinje,
    avsluttetTidslinjeVeileder,
    sampleTidslinje,
    tidslinjeMedKunBekreftelse,
    tidslinjeMedKunOpplysninger,
} from './__mocks__/tidslinje-mock-data';
import { Historikk } from './historikk';

const meta = {
    title: 'Historikk/Historikk',
    component: Historikk,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ParamsFromContextProvider>
                <TidslinjeSelectionProvider>
                    <div className="max-w-4xl mx-auto p-4">
                        <Story />
                    </div>
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

export const AktivPeriode: Story = {
    args: {
        tidslinje: sampleTidslinje,
    },
};

export const AvsluttetPeriode: Story = {
    args: {
        tidslinje: avsluttetTidslinje,
    },
};

export const AvsluttetAvVeilederPeriode: Story = {
    args: {
        tidslinje: avsluttetTidslinjeVeileder,
    },
};

export const KunOpplysninger: Story = {
    args: {
        tidslinje: tidslinjeMedKunOpplysninger,
    },
};

export const KunBekreftelse: Story = {
    args: {
        tidslinje: tidslinjeMedKunBekreftelse,
    },
};
