'use client';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { getPerioder } from '@/lib/api/oppslag-perioder';
import { LoaderSkeleton } from './LoaderSkeleton';
import { Tidslinjer } from './Tidslinjer';

type TidslinjerWrapperProps = {
    initialPerioderPromise: Promise<{
        perioder: Periode[] | null;
        error?: Error;
    }>;
};

const TidslinjeWrapper: React.FC<TidslinjerWrapperProps> = ({ initialPerioderPromise }) => {
    const { fnr } = useModiaContext();
    const { dataPromise, isPending } = useServerData(initialPerioderPromise, getPerioder);

    if (!fnr) {
        return <ManglerPersonEllerEnhet />;
    }

    return (
        <Suspense fallback={<LoaderSkeleton />}>
            {isPending && <Loader size='medium' title='Henter tidslinjer' />}
            <Tidslinjer perioderPromise={dataPromise} />
        </Suspense>
    );
};

export { TidslinjeWrapper };
