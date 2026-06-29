'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense, useCallback } from 'react';
import { Kartlegging } from '@/app/(forside)/components/kartlegging';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';
import { getKartlegging, type KartleggingApiResult } from '@/lib/api/kartlegging';
import { getNokkeltall, type NokkeltallResult } from '@/lib/api/nokkeltall';
import { getSnapshot, type SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { Forside } from './Forside';

type ForsideWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialBekreftelserPromise: Promise<BekreftelseApiResult>;
    initialNokkeltallPromise: Promise<NokkeltallResult | null>;
    initialKartleggingPromise: Promise<KartleggingApiResult | null>;
};

function ForsideWrapper({
    initialSnapshotPromise,
    initialBekreftelserPromise,
    initialNokkeltallPromise,
    initialKartleggingPromise,
}: ForsideWrapperProps) {
    const { fnr } = useModiaContext();
    const { dataPromise, isPending: snapshotIsPending } = useServerData(initialSnapshotPromise, getSnapshot);
    const { dataPromise: bekreftelserPromise, isPending: bekreftelserIsPending } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
    );
    const { dataPromise: nokkeltallPromise } = useServerData(initialNokkeltallPromise, getNokkeltall);
    const fetchKartlegging = useCallback(
        (_fnr: string | null, enhetsId: string | null) => getKartlegging(enhetsId),
        [],
    );
    const { dataPromise: kartleggingPromise } = useServerData(initialKartleggingPromise, fetchKartlegging);

    if (!fnr) {
        return <Kartlegging kartleggingPromise={kartleggingPromise} />;
    }

    return (
        <div>
            <Suspense fallback={<Loader />}>
                {(snapshotIsPending || bekreftelserIsPending) && <Loader size='medium' title='Henter informasjon' />}
                <Forside
                    snapshotPromise={dataPromise}
                    bekreftelserPromise={bekreftelserPromise}
                    nokkeltallPromise={nokkeltallPromise}
                />
            </Suspense>
        </div>
    );
}

export { ForsideWrapper };
