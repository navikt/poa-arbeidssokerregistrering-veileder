'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';
import { getNokkeltall, type NokkeltallResult } from '@/lib/api/nokkeltall';
import { getSnapshot, type SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { getOversikten, type OversiktenApiResult } from '@/lib/api/oversikten';
import { Forside } from './Forside';
import { Oversikten } from './Oversikten';

type ForsideWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialBekreftelserPromise: Promise<BekreftelseApiResult>;
    initialNokkeltallPromise: Promise<NokkeltallResult | null>;
    initialOversiktenPromise: Promise<OversiktenApiResult>;
};

function ForsideWrapper({
    initialSnapshotPromise,
    initialBekreftelserPromise,
    initialNokkeltallPromise,
    initialOversiktenPromise,
}: ForsideWrapperProps) {
    const { fnr } = useModiaContext();
    const { dataPromise, isPending: snapshotIsPending } = useServerData(initialSnapshotPromise, getSnapshot);
    const { dataPromise: bekreftelserPromise, isPending: bekreftelserIsPending } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
    );
    const { dataPromise: nokkeltallPromise } = useServerData(initialNokkeltallPromise, getNokkeltall);
    const { dataPromise: oversiktenPromise } = useServerData(initialOversiktenPromise, getOversikten);

    if (!fnr) {
        return <Oversikten oversiktenPromise={oversiktenPromise} />;
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
