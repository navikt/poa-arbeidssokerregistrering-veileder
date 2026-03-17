'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { getSisteArbeidsforholdFraAareg, type SisteArbeidsforholdResult } from '@/lib/api/aareg';
import { getSnapshot, type SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { RegistrerArbeidssoeker } from './RegistrerArbeidssoeker';

type RegistreringsWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialSisteArbeidsforholdPromise: Promise<SisteArbeidsforholdResult>;
};

function RegistreringsWrapper({
    initialSnapshotPromise,
    initialSisteArbeidsforholdPromise,
}: RegistreringsWrapperProps) {
    const { fnr } = useModiaContext();
    const { dataPromise: snapshotPromise, isPending: snapshotIsPending } = useServerData(
        initialSnapshotPromise,
        getSnapshot,
    );
    const { dataPromise: sisteArbeidsforholdPromise, isPending: aaregIsPending } = useServerData(
        initialSisteArbeidsforholdPromise,
        getSisteArbeidsforholdFraAareg,
    );

    const isPending = snapshotIsPending || aaregIsPending;

    if (!fnr) {
        return <ManglerPersonEllerEnhet />;
    }

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
