'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense, useCallback, useState } from 'react';
import { Kartlegging } from '@/app/(forside)/components/kartlegging';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';
import { getKartlegging, type KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import {
    getKartleggingForEnkeltperson,
    type KartleggingApiEnkeltpersonKompaktResult,
} from '@/lib/api/kartlegging-enkeltperson';
import { getSnapshot, type SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { Forside } from './Forside';

type ForsideWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialBekreftelserPromise: Promise<BekreftelseApiResult>;
    initialKartleggingPromise: Promise<KartleggingApiKompaktResult | null>;
    initialKartleggingEnkeltpersonPromise: Promise<KartleggingApiEnkeltpersonKompaktResult | null>;
    initialContext: { fnr: string | null; enhetId: string | null };
};

function KartleggingInnhold({
    initialKartleggingPromise,
    initialContext,
    refreshOnMount,
}: Pick<ForsideWrapperProps, 'initialKartleggingPromise' | 'initialContext'> & { refreshOnMount: boolean }) {
    const { fnr, enhetId } = useModiaContext();
    const fetchKartlegging = useCallback(
        (_fnr: string | null, enhetsId: string | null) => getKartlegging(enhetsId),
        [],
    );
    const { dataPromise: kartleggingPromise, dataContext: kartleggingContext } = useServerData(
        initialKartleggingPromise,
        fetchKartlegging,
        initialContext,
        refreshOnMount,
    );
    if (kartleggingContext.fnr !== fnr || kartleggingContext.enhetId !== enhetId) {
        return <Loader title='Henter kartlegging' />;
    }
    return (
        <Suspense fallback={<Loader title='Henter kartlegging' />}>
            <Kartlegging kartleggingPromise={kartleggingPromise} />
        </Suspense>
    );
}

function PersonInnhold({
    initialSnapshotPromise,
    initialBekreftelserPromise,
    initialKartleggingEnkeltpersonPromise,
    initialContext,
    refreshOnMount,
}: Omit<ForsideWrapperProps, 'initialKartleggingPromise'> & { refreshOnMount: boolean }) {
    const { fnr, enhetId } = useModiaContext();
    const { dataPromise, dataContext: snapshotContext } = useServerData(
        initialSnapshotPromise,
        getSnapshot,
        initialContext,
        refreshOnMount,
    );
    const { dataPromise: bekreftelserPromise, dataContext: bekreftelserContext } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
        initialContext,
        refreshOnMount,
    );
    const fetchKartleggingEnkeltperson = useCallback((fnr: string | null) => getKartleggingForEnkeltperson(fnr), []);
    const { dataPromise: kartleggingEnkeltpersonPromise, dataContext: enkeltpersonContext } = useServerData(
        initialKartleggingEnkeltpersonPromise,
        fetchKartleggingEnkeltperson,
        initialContext,
        refreshOnMount,
    );

    if (
        snapshotContext.fnr !== fnr ||
        snapshotContext.enhetId !== enhetId ||
        bekreftelserContext.fnr !== fnr ||
        bekreftelserContext.enhetId !== enhetId ||
        enkeltpersonContext.fnr !== fnr ||
        enkeltpersonContext.enhetId !== enhetId
    ) {
        return <Loader title='Henter informasjon' />;
    }

    return (
        <div>
            <Suspense fallback={<Loader title='Henter informasjon' />}>
                <Forside
                    snapshotPromise={dataPromise}
                    bekreftelserPromise={bekreftelserPromise}
                    kartleggingEnkeltpersonPromise={kartleggingEnkeltpersonPromise}
                />
            </Suspense>
        </div>
    );
}

function ForsideWrapper(props: ForsideWrapperProps) {
    const { fnr, enhetId } = useModiaContext();
    const contextKey = JSON.stringify([fnr, enhetId]);
    const [contextState, setContextState] = useState({ key: contextKey, changed: false });

    if (contextState.key !== contextKey) {
        setContextState({ key: contextKey, changed: true });
        return <Loader title={fnr ? 'Henter informasjon' : 'Henter kartlegging'} />;
    }

    return fnr ? (
        <PersonInnhold key={contextKey} {...props} refreshOnMount={contextState.changed} />
    ) : (
        <KartleggingInnhold key={contextKey} {...props} refreshOnMount={contextState.changed} />
    );
}

export { ForsideWrapper };
