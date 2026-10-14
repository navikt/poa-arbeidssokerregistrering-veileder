import { Box } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Suspense, useMemo } from 'react';
import { ModiaProvider } from '@/contexts/modia-context';
import type { KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import type { ArbeidssokerKompakt, LedighetsperiodeKompakt } from '@/model/kartlegging-api';
import { ITEMS_PER_PAGE } from './constants';
import { Kartlegging } from './KartleggingGrid';

function lagArbeidssoker(
    id: number,
    dagerLedig: number,
    periode: Partial<LedighetsperiodeKompakt> = {},
): ArbeidssokerKompakt {
    const ledigSiden = new Date();
    ledigSiden.setDate(ledigSiden.getDate() - dagerLedig);
    ledigSiden.setHours(12, 0, 0, 0);

    return {
        id,
        aktorId: `syntetisk-aktor-${id}`,
        identitetsnummer: `syntetisk-identifikator-${id}`,
        fornavn: 'TEST',
        etternavn: `ARBEIDSSØKER ${id}`,
        ledighetsperioder: [
            {
                periodeStartet: ledigSiden.toISOString(),
                ledigSiden: ledigSiden.toISOString(),
                bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET'],
                ...periode,
            },
        ],
        kontortilknytninger: [],
    };
}

function KartleggingGridPreview({ result }: { result: KartleggingApiKompaktResult }) {
    const kartleggingPromise = useMemo(() => Promise.resolve(result), [result]);

    return (
        <Suspense fallback='Henter kartlegging'>
            <Kartlegging kartleggingPromise={kartleggingPromise} />
        </Suspense>
    );
}

const meta = {
    title: 'Forside/KartleggingGrid',
    component: KartleggingGridPreview,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ModiaProvider initFnr={null} initEnhetId='9999'>
                <Box padding={{ xs: 'space-16', md: 'space-24' }}>
                    <Story />
                </Box>
            </ModiaProvider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof KartleggingGridPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MedFaBrukere: Story = {
    name: 'Med få brukere',
    args: {
        result: {
            arbeidssoekere: [
                lagArbeidssoker(1, 220, {
                    bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET', 'DAGPENGER'],
                    egenvurdertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                    bekreftelseHarJobbet: false,
                }),
                lagArbeidssoker(2, 165, {
                    bekreftelsePaaVegneAv: ['FRISKMELDT_TIL_ARBEIDSFORMIDLING'],
                    egenvurdertTil: 'ANTATT_GODE_MULIGHETER',
                    bekreftelseHarJobbet: true,
                }),
                lagArbeidssoker(3, 30),
            ],
        },
    },
};

export const MedPaginering: Story = {
    name: 'Med paginering',
    args: {
        result: {
            arbeidssoekere: Array.from({ length: ITEMS_PER_PAGE + 1 }, (_, index) =>
                lagArbeidssoker(index + 1, 30 + index * 2),
            ),
        },
    },
};

export const TomListe: Story = {
    name: 'Tom liste',
    args: {
        result: { arbeidssoekere: [] },
    },
};
