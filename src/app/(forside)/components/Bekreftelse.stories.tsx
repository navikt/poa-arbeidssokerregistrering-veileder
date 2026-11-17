import { Box } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Bekreftelse } from './Bekreftelse';
import styles from './Bekreftelse.stories.module.css';

const meta = {
    title: 'Forside/Bekreftelse',
    component: Bekreftelse,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Box className={styles.storyWrapper} marginInline='auto' padding='space-16'>
                <Story />
            </Box>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Viser status for bekreftelse av arbeidssøkerperiode. Kan vise ingen bekreftelser, én bekreftelse, eller flere ubekreftede perioder.',
            },
        },
    },
} satisfies Meta<typeof Bekreftelse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UtenTilgjengeligBekreftelse: Story = {
    name: 'Ingen tilgjengelige bekreftelser',
    args: {
        antallTilgjengeligBekreftelser: undefined,
    },
};

export const EnTilgjengeligBekreftelse: Story = {
    name: 'Én tilgjengelig bekreftelse',
    args: {
        antallTilgjengeligBekreftelser: 1,
    },
};

export const FlereTilgjengeligeBekreftelser: Story = {
    name: 'Flere tilgjengelige bekreftelser',
    args: {
        antallTilgjengeligBekreftelser: 2,
    },
};
