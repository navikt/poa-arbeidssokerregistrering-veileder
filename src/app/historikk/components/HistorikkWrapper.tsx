'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { VisningsTypeProvider } from '@/contexts/hendelse-visning-context';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { getPerioder, type PeriodeResult } from '@/lib/api/oppslag-perioder';
import { Historikk } from './Historikk';

type HistorikkWrapperProps = {
    initialPerioderPromise: Promise<PeriodeResult>;
};

const HistorikkWrapper: React.FC<HistorikkWrapperProps> = ({ initialPerioderPromise }) => {
    const { fnr } = useModiaContext();
    const { dataPromise, isPending } = useServerData(initialPerioderPromise, getPerioder);

    if (!fnr) {
        return <ManglerPersonEllerEnhet />;
    }

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
