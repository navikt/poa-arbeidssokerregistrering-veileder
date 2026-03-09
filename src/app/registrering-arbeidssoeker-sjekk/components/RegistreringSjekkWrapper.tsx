'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { VisningsTypeProvider } from '@/contexts/hendelse-visning-context';
import { useServerData } from '@/hooks/useServerData';
import type { KanStartePeriodeResult } from '@/lib/models/kan-starte-periode';
import { kanStartePeriode } from '../../../lib/api/inngang-kan-starte-periode';
import { RegistreringSjekk } from './RegistreringSjekk';

type RegistreringSjekkWrapperProps = {
    initialKanRegistreresPromise: Promise<KanStartePeriodeResult>;
};

const RegistreringSjekkWrapper: React.FC<RegistreringSjekkWrapperProps> = ({ initialKanRegistreresPromise }) => {
    const { dataPromise, isPending } = useServerData(initialKanRegistreresPromise, kanStartePeriode);

    return (
        <VisningsTypeProvider>
            <Suspense fallback={<LoaderSkeleton />}>
                {isPending && <Loader size='medium' title='Sjekk om kan starte periode' />}
                <RegistreringSjekk kanStartePromise={dataPromise} />
            </Suspense>
        </VisningsTypeProvider>
    );
};

export { RegistreringSjekkWrapper };
