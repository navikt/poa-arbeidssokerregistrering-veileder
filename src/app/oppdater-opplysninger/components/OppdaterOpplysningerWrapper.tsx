'use client';
import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { useServerData } from '@/app/hooks/useServerData';
import { getSisteArbeidsforholdFraAareg, type SisteArbeidsforholdResult } from '@/app/lib/api/aareg';
import { getSnapshot, type SnapshotResult } from '@/app/lib/oppslag/snapshot';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';

type OppdaterOpplysningerWrapperProps = {
    initialSnapshotPromise: Promise<SnapshotResult>;
    initialSisteArbeidsforholdPromise: Promise<SisteArbeidsforholdResult>;
};

function OppdaterOpplysningerWrapper({
    initialSnapshotPromise,
    initialSisteArbeidsforholdPromise,
}: OppdaterOpplysningerWrapperProps) {
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
            <OppdaterOpplysninger
                snapshotPromise={snapshotPromise}
                sisteArbeidsforholdPromise={sisteArbeidsforholdPromise}
            />
        </Suspense>
    );
}
export { OppdaterOpplysningerWrapper };
