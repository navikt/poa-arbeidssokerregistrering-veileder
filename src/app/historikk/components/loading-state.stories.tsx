import type { Meta, StoryObj } from '@storybook/nextjs';
import { HistorikkInnholdSkeleton } from './HistorikkLoadingSkeleton';

const meta = {
    title: 'Historikk/Loading State',
    component: HistorikkInnholdSkeleton,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className='max-w-6xl mx-auto p-4'>
                <Story />
            </div>
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
