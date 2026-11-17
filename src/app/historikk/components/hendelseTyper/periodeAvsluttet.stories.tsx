import { Box } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { VisningsTypeProvider } from '@/contexts/hendelse-visning-context';
import { avsluttetPeriode } from '../__mocks__/tidslinje-mock-data';
import { PeriodeAvsluttet } from './periodeAvsluttet';

const meta = {
    title: 'Historikk/HendelseTyper/Periode Avsluttet',
    component: PeriodeAvsluttet,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <VisningsTypeProvider>
                <Box maxWidth='56rem' marginInline='auto' padding='space-16'>
                    <Story />
                </Box>
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
