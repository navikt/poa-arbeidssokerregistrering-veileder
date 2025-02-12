import type { Meta, StoryObj } from '@storybook/react';
import IkkeAktivPeriode from './ikke-aktiv-periode';

const meta = {
    title: 'Forside/IkkeAktivPeriode',
    component: IkkeAktivPeriode,
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof IkkeAktivPeriode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UtenOpplysninger: Story = {
    args: {
        samletInformasjon: {
            arbeidssoekerperioder: [],
            opplysningerOmArbeidssoeker: [],
            bekreftelser: [],
            profilering: [],
        },
    },
};
