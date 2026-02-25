import type { Meta, StoryObj } from '@storybook/nextjs';
import { VisningsTypeProvider } from '@/app/contexts/hendelse-visning-context';
import { opplysningsHendelse } from '../__mocks__/tidslinje-mock-data';
import { Opplysninger } from './opplysninger';

const meta = {
    title: 'Historikk/HendelseTyper/Opplysninger',
    component: Opplysninger,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <VisningsTypeProvider>
                <div className='max-w-4xl mx-auto p-4'>
                    <Story />
                </div>
            </VisningsTypeProvider>
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
