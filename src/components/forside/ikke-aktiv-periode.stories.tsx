import type { Meta, StoryObj } from '@storybook/react';
import IkkeAktivPeriode from './ikke-aktiv-periode';
import { JaEllerNei, UtdanningGodkjentValg } from '@navikt/arbeidssokerregisteret-utils';

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

export const MedOpplysninger: Story = {
    args: {
        samletInformasjon: {
            arbeidssoekerperioder: [],
            opplysningerOmArbeidssoeker: [
                {
                    opplysningerOmArbeidssoekerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    sendtInnAv: {
                        tidspunkt: '2021-09-29T11:22:33.444Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: '12345678910',
                        },
                        kilde: '',
                        aarsak: 'string',
                    },
                    utdanning: {
                        nus: '3',
                        bestaatt: 'JA' as JaEllerNei,
                        godkjent: 'JA' as UtdanningGodkjentValg,
                    },
                    helse: {
                        helsetilstandHindrerArbeid: 'JA' as JaEllerNei,
                    },
                    annet: {
                        andreForholdHindrerArbeid: 'JA' as JaEllerNei,
                    },
                    jobbsituasjon: [
                        {
                            beskrivelse: 'UKJENT_VERDI',
                            detaljer: {
                                prosent: '25',
                            },
                        },
                    ],
                },
            ],
            bekreftelser: [],
            profilering: [],
        },
    },
};
