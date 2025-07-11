import type { Meta, StoryObj } from '@storybook/nextjs';
import Bekreftelse from './bekreftelse';

const meta = {
    title: 'Forside/Bekreftelse',
    component: Bekreftelse,
    tags: ['autodocs'],
} satisfies Meta<typeof Bekreftelse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UtenTilgjengeligBekreftelse: StoryObj<Story> = {
    args: {
        antallTilgjengeligBekreftelser: undefined,
    },
};

export const EnTilgjengeligBekreftelse: StoryObj<Story> = {
    args: {
        antallTilgjengeligBekreftelser: 1,
    },
};

export const FlereTilgjengeligeBekreftelser: StoryObj<Story> = {
    args: {
        antallTilgjengeligBekreftelser: 2,
    },
};
