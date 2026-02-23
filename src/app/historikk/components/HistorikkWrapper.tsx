'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { VisningsTypeProvider } from '@/app/contexts/hendelse-visning-context';
import { useServerData } from '@/app/hooks/useServerData';
import { getPerioder, type PeriodeResult } from '@/app/lib/oppslag/perioder';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { Historikk } from './Historikk';

type HistorikkWrapperProps = {
    initialPerioderPromise: Promise<PeriodeResult>;
};

const HistorikkWrapper: React.FC<HistorikkWrapperProps> = ({ initialPerioderPromise }) => {
    const { dataPromise, isPending } = useServerData(initialPerioderPromise, getPerioder);

    return (
        <VisningsTypeProvider>
            <Suspense fallback={<LoaderSkeleton />}>
                {isPending && <Loader size='medium' title='Henter historikk' />}
                <Historikk perioderPromise={dataPromise} />
            </Suspense>
        </VisningsTypeProvider>
    );
};

export { HistorikkWrapper };
