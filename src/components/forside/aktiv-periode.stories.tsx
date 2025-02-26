import AktivPeriode from './aktiv-periode';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { JaEllerNei, UtdanningGodkjentValg } from '@navikt/arbeidssokerregisteret-utils';

const meta = {
    title: 'Forside/AktivPeriode',
    component: AktivPeriode,
    parameters: {
        msw: {
            handlers: [
                http.post('/api/tilgjengelige-bekreftelser', () => {
                    return HttpResponse.json([]);
                }),
            ],
        },
    },
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
                        tidspunktFraKilde: null,
                        utfoertAv: {
                            type: 'SYSTEM',
                            // id: '12345678910',
                        },
                        kilde: 'string',
                        aarsak: 'string',
                    },
                    avsluttet: null,
                },
            ],
            opplysningerOmArbeidssoeker: [
                {
                    opplysningerOmArbeidssoekerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    sendtInnAv: {
                        tidspunkt: '2021-09-29T11:22:33.444Z',
                        utfoertAv: {
                            type: 'UKJENT_VERDI',
                            id: '12345678910',
                        },
                        kilde: 'string',
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
                            beskrivelse: 'VIL_BYTTE_JOBB',
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
        brukerMock: false,
        fnr: '123',
    },
};

export const MedTilgjengeligBekreftelse: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('/api/tilgjengelige-bekreftelser', () => {
                    return HttpResponse.json([{}]);
                }),
            ],
        },
    },
    args: {
        samletInformasjon: {
            arbeidssoekerperioder: [
                {
                    periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    startet: {
                        tidspunkt: '2021-09-29T11:22:33.444Z',
                        tidspunktFraKilde: null,
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
        fnr: '123',
        brukerMock: false,
    },
};
