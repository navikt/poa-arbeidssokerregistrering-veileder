'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { useServerData } from '@/app/hooks/useServerData';
import { getSisteArbeidsforholdFraAareg, type SisteArbeidsforholdResult } from '@/app/lib/api/aareg';
import { getSnapshot, type SnapshotResult } from '@/app/lib/api/oppslag-snapshot';
import { RegistrerArbeidssoeker } from './RegistrerArbeidssoeker';

type RegistreringsWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialSisteArbeidsforholdPromise: Promise<SisteArbeidsforholdResult>;
};

function RegistreringsWrapper({
    initialSnapshotPromise,
    initialSisteArbeidsforholdPromise,
}: RegistreringsWrapperProps) {
    const { dataPromise: snapshotPromise, isPending: snapshotIsPending } = useServerData(
        initialSnapshotPromise,
        getSnapshot,
    );
    const { dataPromise: sisteArbeidsforholdPromise, isPending: aaregIsPending } = useServerData(
        initialSisteArbeidsforholdPromise,
        getSisteArbeidsforholdFraAareg,
    );

    const isPending = snapshotIsPending || aaregIsPending;
    return (
        <Suspense fallback={<Loader />}>
            {isPending && <Loader size='medium' title='Henter informasjon' />}
            <RegistrerArbeidssoeker
                snapshotPromise={snapshotPromise}
                sisteArbeidsforholdPromise={sisteArbeidsforholdPromise}
            />
        </Suspense>
    );
}

export { RegistreringsWrapper };
