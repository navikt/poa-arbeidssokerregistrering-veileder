import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ForsideWrapper } from '@/app/(forside)/components/ForsideWrapper';
import { HvaErNytt } from '@/app/components/HvaErNytt';
import { ManglerPersonEllerEnhet } from '@/app/components/ManglerPersonEllerEnhet';
import { getBekreftelser } from '@/app/lib/bekreftelser/bekreftelse';
import { hentModiaContext } from '@/app/lib/modia-context-api';
import { getSnapshot } from '@/app/lib/oppslag/snapshot';
import { isFeatureEnabled } from '@/app/lib/unleash/feature-flags';
import DemoLabel from '@/components/demo-label';
import DemoPanel from '@/components/demo-panel';

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
                <ManglerPersonEllerEnhet />
                <ForsideWrapper
                    initialSnapshotPromise={snapshotPromise}
                    initialBekreftelserPromise={bekreftelserPromise}
                />
            </Suspense>
            <section className='flex flex-col items-center p-8'>
                <DemoPanel />
            </section>
        </div>
    );
}
