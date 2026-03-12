'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';
import { getSnapshot, type SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { Forside } from './Forside';

type ForsideWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialBekreftelserPromise: Promise<BekreftelseApiResult>;
};

function ForsideWrapper({ initialSnapshotPromise, initialBekreftelserPromise }: ForsideWrapperProps) {
    const { fnr } = useModiaContext();
    const { dataPromise, isPending: snapshotIsPending } = useServerData(initialSnapshotPromise, getSnapshot);
    const { dataPromise: bekreftelserPromise, isPending: bekreftelserIsPending } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
    );

    if (!fnr) {
        return <ManglerPersonEllerEnhet />;
    }

    return (
        <div>
            <Suspense fallback={<Loader />}>
                {(snapshotIsPending || bekreftelserIsPending) && <Loader size='medium' title='Henter informasjon' />}
                <Forside snapshotPromise={dataPromise} bekreftelserPromise={bekreftelserPromise} />
            </Suspense>
        </div>
    );
}

export { ForsideWrapper };
