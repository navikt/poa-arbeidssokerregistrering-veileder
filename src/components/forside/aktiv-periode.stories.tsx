import AktivPeriode from './aktiv-periode';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { JaEllerNei, UtdanningGodkjentValg } from '@navikt/arbeidssokerregisteret-utils';
import { aggregertePerioderMockData } from '../../pages/api/mocks/oppslag-arbeidssoekerperioder-aggregert';

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
        aggregertPeriode: aggregertePerioderMockData[0] as any,
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
        aggregertPeriode: aggregertePerioderMockData[0] as any,
        fnr: '123',
        brukerMock: false,
    },
};
