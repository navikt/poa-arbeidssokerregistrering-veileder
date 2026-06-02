'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
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
    initOversiktenPromise: Promise<OversiktenApiResult>;
};

function ForsideWrapper({
    initialSnapshotPromise,
    initialBekreftelserPromise,
    initialNokkeltallPromise,
    initOversiktenPromise,
}: ForsideWrapperProps) {
    const { fnr, enhetId } = useModiaContext();
    const { dataPromise, isPending: snapshotIsPending } = useServerData(initialSnapshotPromise, getSnapshot);
    const { dataPromise: bekreftelserPromise, isPending: bekreftelserIsPending } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
    );
    const { dataPromise: nokkeltallPromise } = useServerData(initialNokkeltallPromise, getNokkeltall);
    const { dataPromise: oversiktenPromise } = useServerData(initOversiktenPromise, getOversikten);

    if (!fnr && enhetId === '4154') {
        return <Oversikten oversiktenPromise={oversiktenPromise} />;
    }
    if (!fnr) {
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
