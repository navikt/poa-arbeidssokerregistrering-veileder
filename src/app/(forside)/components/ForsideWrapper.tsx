'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { useServerData } from '@/app/hooks/useServerData';
import { type BekreftelseApiResult, getBekreftelser } from '@/app/lib/bekreftelser/bekreftelse';
import { getSnapshot, type SnapshotResult } from '@/app/lib/oppslag/snapshot';
import { Forside } from './Forside';

type ForsideWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialBekreftelserPromise: Promise<BekreftelseApiResult>;
};

function ForsideWrapper({ initialSnapshotPromise, initialBekreftelserPromise }: ForsideWrapperProps) {
    const { dataPromise, isPending: snapshotIsPending } = useServerData(initialSnapshotPromise, getSnapshot);
    const { dataPromise: bekreftelserPromise, isPending: bekreftelserIsPending } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
    );

    return (
        <div>
            <Suspense fallback={'Laster...'}>
                {snapshotIsPending || (bekreftelserIsPending && <Loader size='medium' title='Henter informasjon' />)}
                <Forside snapshotPromise={dataPromise} bekreftelserPromise={bekreftelserPromise} />
            </Suspense>
        </div>
    );
}

export { ForsideWrapper };
