import { Box } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { HistorikkInnholdSkeleton } from './HistorikkLoadingSkeleton';

const meta = {
    title: 'Historikk/Loading State',
    component: HistorikkInnholdSkeleton,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Box maxWidth='72rem' marginInline='auto' padding='space-16'>
                <Story />
            </Box>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Skeleton som blir vist mens tidslinjer blir hentet fra APIet. Gir en visuell indikasjon av at noe skjer, og hva som kan forventes.',
            },
        },
    },
} satisfies Meta<typeof HistorikkInnholdSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadingSkeleton: Story = {};
