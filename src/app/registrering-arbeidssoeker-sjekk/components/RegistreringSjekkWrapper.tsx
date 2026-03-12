'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { VisningsTypeProvider } from '@/contexts/hendelse-visning-context';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import type { KanStartePeriodeResult } from '@/model/kan-starte-periode';
import { kanStartePeriode } from '../../../lib/api/inngang-kan-starte-periode';
import { RegistreringSjekk } from './RegistreringSjekk';

type RegistreringSjekkWrapperProps = {
    initialKanRegistreresPromise: Promise<KanStartePeriodeResult>;
};

const RegistreringSjekkWrapper: React.FC<RegistreringSjekkWrapperProps> = ({ initialKanRegistreresPromise }) => {
    const { fnr } = useModiaContext();
    const { dataPromise, isPending } = useServerData(initialKanRegistreresPromise, kanStartePeriode);

    if (!fnr) {
        return <ManglerPersonEllerEnhet />;
    }

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
