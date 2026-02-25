import type { Meta, StoryObj } from '@storybook/nextjs';
import { VisningsTypeProvider } from '@/app/contexts/hendelse-visning-context';
import { bekreftelseHendelse } from '../__mocks__/tidslinje-mock-data';
import { Bekreftelse } from './bekreftelse';

const meta = {
    title: 'Historikk/HendelseTyper/Bekreftelse',
    component: Bekreftelse,
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
} satisfies Meta<typeof Bekreftelse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        bekreftelse: bekreftelseHendelse,
    },
};
