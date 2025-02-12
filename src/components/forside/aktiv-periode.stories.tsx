import AktivPeriode from './aktiv-periode';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Forside/AktivPeriode',
    component: AktivPeriode,
    tags: ['autodocs'],
} satisfies Meta<typeof AktivPeriode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        samletInformasjon: {
            arbeidssoekerperioder: [
                {
                    periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    startet: {
                        tidspunkt: '2021-09-29T11:22:33.444Z',
                        utfoertAv: {
                            type: 'UKJENT_VERDI',
                            // id: '12345678910',
                        },
                        kilde: 'string',
                        aarsak: 'string',
                    },
                    avsluttet: null,
                },
            ],
            opplysningerOmArbeidssoeker: [],
            bekreftelser: [],
            profilering: [],
        },
    },
};
