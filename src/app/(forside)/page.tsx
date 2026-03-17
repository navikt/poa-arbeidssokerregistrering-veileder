import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ForsideWrapper } from '@/app/(forside)/components/ForsideWrapper';
import { DemoLabel } from '@/components/demo-label';
import { DemoPanel } from '@/components/demo-panel';
import { HvaErNytt } from '@/components/HvaErNytt';
import { getBekreftelser } from '@/lib/api/bekreftelse';
import { getSnapshot } from '@/lib/api/oppslag-snapshot';
import { hentModiaContext } from '@/lib/modia-context-api';
import { isFeatureEnabled } from '@/lib/unleash/feature-flags';

export default async function ForsidePage() {
    const modiaContext = await hentModiaContext();
    const flagVisHvaSomErNyttPromise = isFeatureEnabled('arbeidssokerregistrering-for-veileder.vis-hva-er-nytt');
    const snapshotPromise = getSnapshot(modiaContext.fnr);
    const bekreftelserPromise = getBekreftelser(modiaContext.fnr);

    const flagVisHvaSomErNytt = await flagVisHvaSomErNyttPromise;

    return (
        <div className={'flex flex-col max-w-3xl'}>
            <DemoLabel />
            {flagVisHvaSomErNytt && <HvaErNytt />}
            <Suspense fallback={<Loader />}>
                <ForsideWrapper
                    initialSnapshotPromise={snapshotPromise}
                    initialBekreftelserPromise={bekreftelserPromise}
                />
            </Suspense>
            <DemoPanel />
        </div>
    );
}
