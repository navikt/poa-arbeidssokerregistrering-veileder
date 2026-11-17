import { Box } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { VisningsTypeProvider } from '@/contexts/hendelse-visning-context';
import { opplysningsHendelse } from '../__mocks__/tidslinje-mock-data';
import { Opplysninger } from './opplysninger';

const meta = {
    title: 'Historikk/HendelseTyper/Opplysninger',
    component: Opplysninger,
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
} satisfies Meta<typeof Opplysninger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        opplysninger: opplysningsHendelse,
    },
};
