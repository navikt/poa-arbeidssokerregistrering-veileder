import { Meta, StoryObj } from '@storybook/nextjs';
import { ParamsFromContextProvider } from '../../../contexts/params-from-context';
import { TidslinjeSelectionProvider } from '../../../contexts/tidslinje-selection-context';
import { opplysningsHendelse } from '../__mocks__/tidslinje-mock-data';
import { Opplysninger } from './opplysninger';

const meta = {
    title: 'Historikk/HendelseTyper/Opplysninger',
    component: Opplysninger,
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
} satisfies Meta<typeof Opplysninger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        opplysninger: opplysningsHendelse,
    },
};
