import type { Meta, StoryObj } from '@storybook/nextjs';
import type { SnapshotResult } from '@/app/lib/oppslag/snapshot';
import snapshotMock from '@/app/mocks/snapshot.json';
import { Opplysninger } from './Opplysninger';

const snapshot = snapshotMock as unknown as NonNullable<SnapshotResult['snapshot']>;

const meta = {
    title: 'Forside/Opplysninger',
    component: Opplysninger,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className='max-w-3xl mx-auto p-4'>
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Viser opplysninger om arbeidssøkeren, inkludert utdanning, jobbsituasjon, helse og eventuell egenvurdering. Hvis opplysninger mangler vises en oppfordring om å legge til opplysninger.',
            },
        },
    },
} satisfies Meta<typeof Opplysninger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MedOpplysninger: Story = {
    name: 'Med opplysninger og egenvurdering',
    args: {
        opplysninger: snapshot.opplysning,
        sisteArbeidssoekerperiodeId: snapshot.id,
        egenvurderinger: snapshot.egenvurdering,
    },
};

export const MedOpplysningerUtenEgenvurdering: Story = {
    name: 'Med opplysninger uten egenvurdering',
    args: {
        opplysninger: snapshot.opplysning,
        sisteArbeidssoekerperiodeId: snapshot.id,
        egenvurderinger: undefined,
    },
};

export const UtenOpplysninger: Story = {
    name: 'Mangler opplysninger',
    args: {
        opplysninger: undefined,
        sisteArbeidssoekerperiodeId: snapshot.id,
        egenvurderinger: undefined,
    },
};
