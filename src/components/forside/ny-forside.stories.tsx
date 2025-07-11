import { http, HttpResponse } from 'msw';
import type { Meta, StoryObj } from '@storybook/nextjs';
import NyForside from './ny-forside';
import { ParamsFromContextProvider } from '../../contexts/params-from-context';
import { JaEllerNei, UtdanningGodkjentValg } from '@navikt/arbeidssokerregisteret-utils';
import { aggregertePerioderMockData } from '../../pages/api/mocks/oppslag-arbeidssoekerperioder-aggregert';

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
                http.post('/api/oppslag-arbeidssoekerperioder-aggregert?siste=true', () => {
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
                http.post('/api/oppslag-arbeidssoekerperioder-aggregert?siste=true', () => {
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
                http.post('/api/oppslag-arbeidssoekerperioder-aggregert?siste=true', () => {
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
                http.post('/api/oppslag-arbeidssoekerperioder-aggregert?siste=true', () => {
                    return HttpResponse.json(aggregertePerioderMockData.slice(0, 1));
                }),
            ],
        },
    },
};
