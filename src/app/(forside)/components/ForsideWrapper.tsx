'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense, useCallback } from 'react';
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

function ForsideWrapper({
    initialSnapshotPromise,
    initialBekreftelserPromise,
    initialKartleggingPromise,
    initialKartleggingEnkeltpersonPromise,
    initialContext,
}: ForsideWrapperProps) {
    const { fnr, enhetId } = useModiaContext();
    const { dataPromise, dataContext: snapshotContext } = useServerData(
        initialSnapshotPromise,
        getSnapshot,
        initialContext,
    );
    const { dataPromise: bekreftelserPromise, dataContext: bekreftelserContext } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
        initialContext,
    );
    const fetchKartlegging = useCallback(
        (_fnr: string | null, enhetsId: string | null) => getKartlegging(enhetsId),
        [],
    );

    const fetchKartleggingEnkeltperson = useCallback((fnr: string | null) => getKartleggingForEnkeltperson(fnr), []);

    const { dataPromise: kartleggingPromise, dataContext: kartleggingContext } = useServerData(
        initialKartleggingPromise,
        fetchKartlegging,
        initialContext,
    );
    const { dataPromise: kartleggingEnkeltpersonPromise, dataContext: enkeltpersonContext } = useServerData(
        initialKartleggingEnkeltpersonPromise,
        fetchKartleggingEnkeltperson,
        initialContext,
    );

    const gjelderValgtKontekst = (context: { fnr: string | null; enhetId: string | null }) =>
        context.fnr === fnr && context.enhetId === enhetId;

    if (!fnr) {
        return gjelderValgtKontekst(kartleggingContext) ? (
            <Suspense fallback={<Loader title='Henter kartlegging' />}>
                <Kartlegging kartleggingPromise={kartleggingPromise} />
            </Suspense>
        ) : (
            <Loader title='Henter kartlegging' />
        );
    }

    if (
        !gjelderValgtKontekst(snapshotContext) ||
        !gjelderValgtKontekst(bekreftelserContext) ||
        !gjelderValgtKontekst(enkeltpersonContext)
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

export { ForsideWrapper };
