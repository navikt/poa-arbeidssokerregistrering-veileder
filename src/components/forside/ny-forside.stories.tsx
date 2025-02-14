import { http, HttpResponse } from 'msw';
import type { Meta, StoryObj } from '@storybook/react';
import NyForside from './ny-forside';
import { ParamsFromContextProvider } from '../../contexts/params-from-context';
import { JaEllerNei, UtdanningGodkjentValg } from '@navikt/arbeidssokerregisteret-utils';

const meta = {
    title: 'Forside',
    component: NyForside,
    decorators: [
        (Story) => (
            <ParamsFromContextProvider>
                <Story />
            </ParamsFromContextProvider>
        ),
    ],
} satisfies Meta<typeof NyForside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const isLoading: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('/api/hent-modia-context', () => HttpResponse.json({ aktivBruker: '123' })),
                http.post('/api/oppslag-samlet-informasjon', () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(HttpResponse.json({}));
                        }, 60000);
                    });
                }),
            ],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('/api/hent-modia-context', () => HttpResponse.json({ aktivBruker: '123' })),
                http.post('/api/oppslag-samlet-informasjon', () => {
                    return new HttpResponse(null, { status: 400 });
                }),
            ],
        },
    },
};

export const IkkeAktivArbeidssoker: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('/api/hent-modia-context', () => HttpResponse.json({ aktivBruker: '123' })),
                http.post('/api/oppslag-samlet-informasjon', () => {
                    return HttpResponse.json({
                        arbeidssoekerperioder: [],
                        opplysningerOmArbeidssoeker: [],
                        bekreftelser: [],
                        profilering: [],
                    });
                }),
            ],
        },
    },
};

export const AktivArbeidssoeker: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('/api/hent-modia-context', () => HttpResponse.json({ aktivBruker: '123' })),
                http.post('/api/tilgjengelige-bekreftelser', () => {
                    return HttpResponse.json([]);
                }),
                http.post('/api/oppslag-samlet-informasjon', () => {
                    return HttpResponse.json({
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
                    });
                }),
            ],
        },
    },
};
