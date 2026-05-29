'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';
import { getNokkeltall, type NokkeltallResult } from '@/lib/api/nokkeltall';
import { getSnapshot, type SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { Forside } from './Forside';

type ForsideWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialBekreftelserPromise: Promise<BekreftelseApiResult>;
    initialNokkeltallPromise: Promise<NokkeltallResult | null>;
};

function ForsideWrapper({
    initialSnapshotPromise,
    initialBekreftelserPromise,
    initialNokkeltallPromise,
}: ForsideWrapperProps) {
    const { fnr, enhetId } = useModiaContext();
    const { dataPromise, isPending: snapshotIsPending } = useServerData(initialSnapshotPromise, getSnapshot);
    const { dataPromise: bekreftelserPromise, isPending: bekreftelserIsPending } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
    );
    const { dataPromise: nokkeltallPromise } = useServerData(initialNokkeltallPromise, getNokkeltall);

    if (!fnr || !enhetId) {
        return <ManglerPersonEllerEnhet />;
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
