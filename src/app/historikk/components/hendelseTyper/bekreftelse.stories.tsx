import type { Meta, StoryObj } from '@storybook/nextjs';
import { bekreftelseHendelse } from '../__mocks__/tidslinje-mock-data';
import { Bekreftelse } from './bekreftelse';

const meta = {
    title: 'Historikk/HendelseTyper/Bekreftelse',
    component: Bekreftelse,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className='max-w-4xl mx-auto p-4'>
                <Story />
            </div>
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
