import type { Meta, StoryObj } from '@storybook/nextjs';
import { http, HttpResponse } from 'msw';
import { ParamsFromContextProvider } from '../../contexts/params-from-context';
import { TidslinjeSelectionProvider } from '../../contexts/tidslinje-selection-context';
import { data } from '../../pages/api/mocks/tidslinjer';
import HistorikkTidslinjer from '../../pages/historikk';

const meta = {
    title: 'Historikk/Historikk siden',
    component: HistorikkTidslinjer,
    decorators: [
        (Story) => (
            <ParamsFromContextProvider>
                <TidslinjeSelectionProvider>
                    <div className="max-w-6xl mx-auto p-4">
                        <Story />
                    </div>
                </TidslinjeSelectionProvider>
            </ParamsFromContextProvider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Viser hele historikk siden. Historikk Med Data viser en side med perioder, Historikk Uten Data viser fallback når ingen perioder finnes.',
            },
        },
    },
} satisfies Meta<typeof HistorikkTidslinjer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HistorikkMedData: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('/api/hent-modia-context/', () =>
                    HttpResponse.json({
                        aktivBruker: '12345678901',
                        aktivEnhet: '9999',
                    }),
                ),
                http.post('/api/tidslinjer', async () => {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    return HttpResponse.json(data);
                }),
            ],
        },
    },
};

export const HistorikkUtenData: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('/api/hent-modia-context/', () =>
                    HttpResponse.json({
                        aktivBruker: '12345678901',
                        aktivEnhet: '9999',
                    }),
                ),
                http.post('/api/tidslinjer', async () => {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    return HttpResponse.json({});
                }),
            ],
        },
    },
};
