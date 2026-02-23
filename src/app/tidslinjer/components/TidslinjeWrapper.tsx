'use client';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { useServerData } from '@/app/hooks/useServerData';
import { getPerioder } from '@/app/lib/oppslag/perioder';
import { LoaderSkeleton } from './LoaderSkeleton';
import { Tidslinjer } from './Tidslinjer';

type TidslinjerWrapperProps = {
    initialPerioderPromise: Promise<{
        perioder: Periode[] | null;
        error?: Error;
    }>;
};

const TidslinjeWrapper: React.FC<TidslinjerWrapperProps> = ({ initialPerioderPromise }) => {
    const { dataPromise, isPending } = useServerData(initialPerioderPromise, getPerioder);

    return (
        <Suspense fallback={<LoaderSkeleton />}>
            {isPending && <Loader size='medium' title='Henter tidslinjer' />}
            <Tidslinjer perioderPromise={dataPromise} />
        </Suspense>
    );
};

export { TidslinjeWrapper };
