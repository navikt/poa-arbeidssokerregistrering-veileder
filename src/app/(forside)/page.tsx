import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ForsideWrapper } from '@/app/(forside)/components/ForsideWrapper';
import { DemoLabel } from '@/components/demo-label';
import { DemoPanel } from '@/components/demo-panel';
import { HvaErNytt } from '@/components/HvaErNytt';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';
import { getNokkeltall } from '@/lib/api/nokkeltall';
import { getSnapshot, type SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { getOversikten } from '@/lib/api/oversikten';
import { hentModiaContext } from '@/lib/modia-context-api';
import { isFeatureEnabled } from '@/lib/unleash/feature-flags';

export default async function ForsidePage() {
    const modiaContext = await hentModiaContext();
    const flagVisHvaSomErNyttPromise = isFeatureEnabled('arbeidssokerregistrering-for-veileder.vis-hva-er-nytt');

    const snapshotPromise = modiaContext.fnr
        ? getSnapshot(modiaContext.fnr)
        : Promise.resolve({ snapshot: null } satisfies SnapshotResult);
    const bekreftelserPromise = modiaContext.fnr
        ? getBekreftelser(modiaContext.fnr)
        : Promise.resolve({ bekreftelser: null } satisfies BekreftelseApiResult);
    const nokkeltallPromise = modiaContext.fnr
        ? getNokkeltall(modiaContext.fnr, modiaContext.enhetId)
        : Promise.resolve(null);
    const oversiktenPromise = modiaContext.fnr ? Promise.resolve(null) : getOversikten(modiaContext.enhetId);

    const flagVisHvaSomErNytt = await flagVisHvaSomErNyttPromise;

    return (
        <div className={'flex flex-col max-w-3xl'}>
            <DemoLabel />
            {flagVisHvaSomErNytt && <HvaErNytt />}
            <Suspense fallback={<Loader />}>
                <ForsideWrapper
                    initialSnapshotPromise={snapshotPromise}
                    initialBekreftelserPromise={bekreftelserPromise}
                    initialNokkeltallPromise={nokkeltallPromise}
                    initialOversiktenPromise={oversiktenPromise}
                />
            </Suspense>
            <DemoPanel />
        </div>
    );
}
