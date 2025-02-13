import type { Meta, StoryObj } from '@storybook/react';
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
        harTilgjengeligBekreftelse: false,
    },
};

export const MedTilgjengeligBekreftelse: StoryObj<Story> = {
    args: {
        harTilgjengeligBekreftelse: true,
    },
};
