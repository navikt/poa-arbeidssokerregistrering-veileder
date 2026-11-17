import { Box } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { VisningsTypeProvider } from '@/contexts/hendelse-visning-context';
import { bekreftelseHendelse } from '../__mocks__/tidslinje-mock-data';
import { Bekreftelse } from './bekreftelse';
import styles from './bekreftelse.stories.module.css';

const meta = {
    title: 'Historikk/HendelseTyper/Bekreftelse',
    component: Bekreftelse,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <VisningsTypeProvider>
                <Box className={styles.container} marginInline='auto' padding='space-16'>
                    <Story />
                </Box>
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
