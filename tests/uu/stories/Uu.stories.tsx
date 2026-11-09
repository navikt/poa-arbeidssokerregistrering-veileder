import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Bekreftelse } from '@/app/bekreftelse/components/Bekreftelse';
import { Forside } from '@/app/(forside)/components/Forside';
import { ForsideWrapper } from '@/app/(forside)/components/ForsideWrapper';
import { Kartlegging } from '@/app/(forside)/components/kartlegging';
import AppError from '@/app/error';
import { HvaErNytt } from '@/components/HvaErNytt';
import { ManglerTilganger } from '@/components/ManglerTilganger';
import { ModiaProvider, useModiaContext } from '@/contexts/modia-context';
import type { BekreftelseApiResult } from '@/lib/api/bekreftelse';
import type { KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import type { KartleggingApiEnkeltpersonKompaktResult } from '@/lib/api/kartlegging-enkeltperson';
import type { SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { getBekreftelser } from '@/lib/api/bekreftelse';
import { getKartlegging } from '@/lib/api/kartlegging';
import { getKartleggingForEnkeltperson } from '@/lib/api/kartlegging-enkeltperson';
import { getSnapshot } from '@/lib/api/oppslag-snapshot';

const meta = {
    id: 'uu',
    title: 'UU',
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const EMPTY_BEKREFTELSER: BekreftelseApiResult = { bekreftelser: [] };
const EMPTY_PERSON_KARTLEGGING: KartleggingApiEnkeltpersonKompaktResult = { arbeidssoekere: [] };
const EMPTY_OFFICE_KARTLEGGING: KartleggingApiKompaktResult = { arbeidssoekere: [] };
const unresolvedSnapshot: Promise<SnapshotResult> = new Promise(() => {});

function OfficeView({ kartleggingPromise }: { kartleggingPromise: Promise<KartleggingApiKompaktResult | null> }) {
    return (
        <ModiaProvider initFnr={null} initEnhetId='syntetisk-kontor-a'>
            <Suspense fallback={<Loader title='Henter kartlegging' />}>
                <Kartlegging kartleggingPromise={kartleggingPromise} />
            </Suspense>
        </ModiaProvider>
    );
}

function PersonView({
    snapshot,
    bekreftelser = EMPTY_BEKREFTELSER,
    kartlegging = EMPTY_PERSON_KARTLEGGING,
}: {
    snapshot: SnapshotResult;
    bekreftelser?: BekreftelseApiResult;
    kartlegging?: KartleggingApiEnkeltpersonKompaktResult;
}) {
    return (
        <ModiaProvider initFnr='syntetisk-person-a' initEnhetId='syntetisk-kontor-a'>
            <Suspense fallback={<Loader title='Henter informasjon' />}>
                <Forside
                    snapshotPromise={Promise.resolve(snapshot)}
                    bekreftelserPromise={Promise.resolve(bekreftelser)}
                    kartleggingEnkeltpersonPromise={Promise.resolve(kartlegging)}
                />
            </Suspense>
        </ModiaProvider>
    );
}

export const Office: Story = {
    render: () => <OfficeView kartleggingPromise={getKartlegging('syntetisk-kontor-a')} />,
};

export const OfficeEmpty: Story = {
    render: () => <OfficeView kartleggingPromise={Promise.resolve(EMPTY_OFFICE_KARTLEGGING)} />,
};

export const OfficeAccessDenied: Story = {
    parameters: { uu: { hasPageHeading: true } },
    render: () => (
        <ModiaProvider initFnr={null} initEnhetId='syntetisk-kontor-a'>
            <Suspense fallback={<Loader title='Henter kartlegging' />}>
                <Kartlegging kartleggingPromise={Promise.resolve({ arbeidssoekere: [], manglerTilgang: true })} />
            </Suspense>
        </ModiaProvider>
    ),
};

export const OfficeError: Story = {
    render: () => (
        <OfficeView kartleggingPromise={Promise.resolve({ arbeidssoekere: [], error: new Error('Syntetisk kontordatafeil') })} />
    ),
};

export const PersonError: Story = {
    render: () => <PersonView snapshot={{ snapshot: null, error: new Error('Syntetisk persondatafeil') }} />,
};

export const PersonEmpty: Story = {
    render: () => <PersonView snapshot={{ snapshot: null, notFound: true }} />,
};

export const Loading: Story = {
    render: () => (
        <ModiaProvider initFnr='syntetisk-person-a' initEnhetId='syntetisk-kontor-a'>
            <Suspense fallback={<Loader title='Henter informasjon' />}>
                <ForsideWrapper
                    initialSnapshotPromise={unresolvedSnapshot}
                    initialBekreftelserPromise={Promise.resolve(EMPTY_BEKREFTELSER)}
                    initialKartleggingPromise={Promise.resolve(null)}
                    initialKartleggingEnkeltpersonPromise={Promise.resolve(EMPTY_PERSON_KARTLEGGING)}
                    initialContext={{ fnr: 'syntetisk-person-a', enhetId: 'syntetisk-kontor-a' }}
                />
            </Suspense>
        </ModiaProvider>
    ),
};

export const GeneralError: Story = {
    parameters: { uu: { hasPageHeading: true } },
    render: () => <AppError error={new Error('Syntetisk feil')} reset={() => {}} />,
};

export const MissingAccess: Story = {
    parameters: { uu: { hasPageHeading: true } },
    render: () => <ManglerTilganger />,
};

export const ConfirmationError: Story = {
    render: () => (
        <ModiaProvider initFnr='syntetisk-person-a' initEnhetId='syntetisk-kontor-a'>
            <Suspense fallback={<Loader title='Henter bekreftelser' />}>
                <Bekreftelse
                    bekreftelserPromise={Promise.resolve({
                        bekreftelser: [
                            {
                                periodeId: 'syntetisk-periode-a',
                                bekreftelseId: 'syntetisk-bekreftelse-a',
                                gjelderFra: '2026-06-01T00:00:00.000Z',
                                gjelderTil: '2026-06-14T23:59:59.000Z',
                            },
                        ],
                    })}
                />
            </Suspense>
        </ModiaProvider>
    ),
};

export const ConfirmationEmpty: Story = {
    render: () => (
        <ModiaProvider initFnr='syntetisk-person-a' initEnhetId='syntetisk-kontor-a'>
            <Suspense fallback={<Loader title='Henter bekreftelser' />}>
                <Bekreftelse bekreftelserPromise={Promise.resolve(EMPTY_BEKREFTELSER)} />
            </Suspense>
        </ModiaProvider>
    ),
};

function ContextControls() {
    const { fnr, enhetId, setFnr, setEnhetId } = useModiaContext();
    const contextLabel = fnr ?? enhetId ?? 'ingen kontekst';

    return (
        <section aria-label='Testkontroller for Modia-kontekst' className='mb-4 flex flex-wrap gap-2'>
            <p className='w-full'>Valgt testkontekst: {contextLabel}</p>
            <button type='button' onClick={() => { setFnr(null); setEnhetId('syntetisk-kontor-a'); }}>
                Vis syntetisk-kontor-a
            </button>
            <button type='button' onClick={() => { setFnr('syntetisk-person-a'); setEnhetId('syntetisk-kontor-a'); }}>
                Vis syntetisk-person-a
            </button>
            <button type='button' onClick={() => { setFnr('syntetisk-person-b'); setEnhetId('syntetisk-kontor-a'); }}>
                Bytt til syntetisk-person-b
            </button>
            <button type='button' onClick={() => { setFnr(null); setEnhetId('syntetisk-kontor-b'); }}>
                Bytt til syntetisk-kontor-b
            </button>
        </section>
    );
}

export const ContextSwitch: Story = {
    render: () => (
        <ModiaProvider initFnr='syntetisk-person-a' initEnhetId='syntetisk-kontor-a'>
            <ContextControls />
            <Suspense fallback={<Loader title='Henter informasjon' />}>
                <ForsideWrapper
                    initialSnapshotPromise={getSnapshot('syntetisk-person-a')}
                    initialBekreftelserPromise={getBekreftelser('syntetisk-person-a')}
                    initialKartleggingPromise={getKartlegging('syntetisk-kontor-a')}
                    initialKartleggingEnkeltpersonPromise={getKartleggingForEnkeltperson('syntetisk-person-a')}
                    initialContext={{ fnr: 'syntetisk-person-a', enhetId: 'syntetisk-kontor-a' }}
                />
            </Suspense>
        </ModiaProvider>
    ),
};

export const WhatsNew: Story = {
    render: () => <HvaErNytt />,
};
