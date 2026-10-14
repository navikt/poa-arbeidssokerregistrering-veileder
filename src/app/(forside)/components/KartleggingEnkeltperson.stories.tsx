import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Box } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { KartleggingEnkeltperson } from './KartleggingEnkeltperson';

const snapshot: Snapshot = {
    id: 'storybook-snapshot',
    identitetsnummer: 'storybook',
    startet: {
        sendtInnAv: {
            tidspunkt: '2026-09-01T08:00:00Z',
            utfoertAv: {
                type: 'VEILEDER',
                id: 'storybook-veileder',
            },
            kilde: 'storybook',
            aarsak: 'Storybook-eksempel',
        },
        tidspunkt: '2026-09-01T08:00:00Z',
        type: 'PERIODE_STARTET_V1',
    },
};

const arbeidssoker: ArbeidssokerKompakt = {
    id: 1,
    aktorId: 'storybook-aktor',
    identitetsnummer: 'storybook',
    fornavn: 'Test',
    etternavn: 'Arbeidssøker',
    ledighetsperioder: [
        {
            periodeStartet: '2026-01-01T00:00:00Z',
            ledigSiden: '2026-01-01T00:00:00Z',
            bekreftelsePaaVegneAv: ['ARBEIDSSOEKERREGISTERET', 'DAGPENGER'],
            egenvurdertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
            bekreftelseHarJobbet: false,
        },
    ],
    kontortilknytninger: [],
};

const meta = {
    title: 'Forside/KartleggingEnkeltperson',
    component: KartleggingEnkeltperson,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Box padding='space-16'>
                <div className='max-w-3xl'>
                    <Story />
                </div>
            </Box>
        ),
    ],
} satisfies Meta<typeof KartleggingEnkeltperson>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MedArbeidssoker: Story = {
    name: 'Med arbeidssøkerdata',
    args: {
        arbeidssoker,
        snapshot,
    },
};

export const UtenArbeidssokerdata: Story = {
    name: 'Uten arbeidssøkerdata',
    args: {
        arbeidssoker: null,
        snapshot,
    },
};
