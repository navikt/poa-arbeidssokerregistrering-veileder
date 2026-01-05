import type { Meta, StoryObj } from '@storybook/nextjs';
import { ParamsFromContextProvider } from '../../contexts/params-from-context';
import { TidslinjeSelectionProvider } from '../../contexts/tidslinje-selection-context';
import { HistorikkInnholdSkeleton } from './historikk-loading-skeleton';

const meta = {
    title: 'Historikk/Loading State',
    component: HistorikkInnholdSkeleton,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ParamsFromContextProvider>
                <TidslinjeSelectionProvider>
                    <div className="max-w-6xl mx-auto p-4">
                        <Story />
                    </div>
                </TidslinjeSelectionProvider>
            </ParamsFromContextProvider>
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
