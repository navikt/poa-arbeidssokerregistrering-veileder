import type { Meta, StoryObj } from '@storybook/nextjs';
import type { BekreftelseApiResult } from '@/app/lib/bekreftelser/bekreftelse';
import type { SnapshotResult } from '@/app/lib/oppslag/snapshot';
import bekreftelserMock from '@/app/mocks/bekfreftelser.json';
import snapshotMock from '@/app/mocks/snapshot.json';
import { Forside } from './Forside';

const happySnapshot: SnapshotResult = {
    snapshot: snapshotMock as SnapshotResult['snapshot'],
};

const happyBekreftelser: BekreftelseApiResult = {
    bekreftelser: bekreftelserMock,
};

const emptyBekreftelser: BekreftelseApiResult = {
    bekreftelser: [],
};

const multipleBekreftelser: BekreftelseApiResult = {
    bekreftelser: [
        ...bekreftelserMock,
        {
            periodeId: 'b54bcdee-6f97-52f1-0a80-42e192962363',
            bekreftelseId: '3ef0de48-e3e5-5987-cbb3-cbc2c8d6844f',
            gjelderFra: '2026-02-22T23:00:00Z',
            gjelderTil: '2026-03-05T23:00:00Z',
        },
    ],
};

const snapshotUtenOpplysninger: SnapshotResult = {
    snapshot: {
        ...snapshotMock,
        opplysning: undefined,
    } as unknown as SnapshotResult['snapshot'],
};

const errorSnapshot: SnapshotResult = {
    snapshot: null,
    error: new Error('Noe gikk galt'),
};

const errorBekreftelser: BekreftelseApiResult = {
    bekreftelser: null,
    error: new Error('Bekreftelse-feil'),
};

const nullSnapshot: SnapshotResult = {
    snapshot: null,
};

const meta = {
    title: 'Forside/Forside',
    component: Forside,
    decorators: [
        (Story) => (
            <div className='max-w-3xl mx-auto p-4'>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Forsiden for veileder. Viser informasjon om arbeidssøkerens registrering, opplysninger, bekreftelser, og lenker til historikk og tidslinjer.',
            },
        },
    },
} satisfies Meta<typeof Forside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AktivArbeidssøkerMedOpplysninger: Story = {
    name: 'Aktiv arbeidssøker med opplysninger',
    args: {
        snapshotPromise: Promise.resolve(happySnapshot),
        bekreftelserPromise: Promise.resolve(happyBekreftelser),
    },
};

export const AktivArbeidssøkerUtenBekreftelser: Story = {
    name: 'Aktiv arbeidssøker uten bekreftelser',
    args: {
        snapshotPromise: Promise.resolve(happySnapshot),
        bekreftelserPromise: Promise.resolve(emptyBekreftelser),
    },
};

export const FlereTilgjengeligeBekreftelser: Story = {
    name: 'Flere tilgjengelige bekreftelser',
    args: {
        snapshotPromise: Promise.resolve(happySnapshot),
        bekreftelserPromise: Promise.resolve(multipleBekreftelser),
    },
};

export const ManglerOpplysninger: Story = {
    name: 'Mangler opplysninger',
    args: {
        snapshotPromise: Promise.resolve(snapshotUtenOpplysninger),
        bekreftelserPromise: Promise.resolve(emptyBekreftelser),
    },
};

export const Feil: Story = {
    name: 'Feil ved henting av data',
    args: {
        snapshotPromise: Promise.resolve(errorSnapshot),
        bekreftelserPromise: Promise.resolve(happyBekreftelser),
    },
};

export const FeilVedBekreftelser: Story = {
    name: 'Feil ved henting av bekreftelser',
    args: {
        snapshotPromise: Promise.resolve(happySnapshot),
        bekreftelserPromise: Promise.resolve(errorBekreftelser),
    },
};

export const IngenData: Story = {
    name: 'Ingen data (ingen aktiv periode)',
    args: {
        snapshotPromise: Promise.resolve(nullSnapshot),
        bekreftelserPromise: Promise.resolve(emptyBekreftelser),
    },
};
