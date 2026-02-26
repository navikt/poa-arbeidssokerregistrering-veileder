import type { Meta, StoryObj } from '@storybook/nextjs';
import { VisningsTypeProvider } from '@/app/contexts/hendelse-visning-context';
import { avsluttetPeriode } from '../__mocks__/tidslinje-mock-data';
import { PeriodeAvsluttet } from './periodeAvsluttet';

const meta = {
    title: 'Historikk/HendelseTyper/Periode Avsluttet',
    component: PeriodeAvsluttet,
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
} satisfies Meta<typeof PeriodeAvsluttet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        avsluttetHendelse: avsluttetPeriode,
    },
};
