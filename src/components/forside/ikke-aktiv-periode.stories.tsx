import type { Meta, StoryObj } from '@storybook/nextjs';
import IkkeAktivPeriode from './ikke-aktiv-periode';
import { JaEllerNei, UtdanningGodkjentValg } from '@navikt/arbeidssokerregisteret-utils';
import { aggregertePerioderMockData } from '../../pages/api/mocks/oppslag-arbeidssoekerperioder-aggregert';

const meta = {
    title: 'Forside/IkkeAktivPeriode',
    component: IkkeAktivPeriode,
    tags: ['autodocs'],
} satisfies Meta<typeof IkkeAktivPeriode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UtenOpplysninger: Story = {
    args: {
        aggregertPeriode: undefined,
    },
};

export const MedOpplysninger: Story = {
    args: {
        aggregertPeriode: aggregertePerioderMockData[1] as any,
    },
};
