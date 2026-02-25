import type { Meta, StoryObj } from '@storybook/nextjs';
import { Bekreftelse } from './Bekreftelse';

const meta = {
    title: 'Forside/Bekreftelse',
    component: Bekreftelse,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className='max-w-3xl mx-auto p-4'>
                <Story />
            </div>
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
