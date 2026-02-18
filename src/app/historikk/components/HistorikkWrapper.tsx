'use client';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { useServerData } from '@/app/hooks/useServerData';
import { getPerioder } from '@/app/lib/oppslag/perioder';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { Historikk } from './Historikk';

type HistorikkWrapperProps = {
    initialPerioderPromise: Promise<{
        perioder: Periode[] | null;
        error?: Error;
    }>;
};

const HistorikkWrapper: React.FC<HistorikkWrapperProps> = ({ initialPerioderPromise }) => {
    const { dataPromise, isPending } = useServerData(initialPerioderPromise, getPerioder);

    return (
        <Suspense fallback={<LoaderSkeleton />}>
            {isPending && <Loader size="medium" title="Henter historikk" />}
            <Historikk perioderPromise={dataPromise} />
        </Suspense>
    );
};

export { HistorikkWrapper };
