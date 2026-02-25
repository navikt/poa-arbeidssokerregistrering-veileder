import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/app/components/ManglerPersonEllerEnhet';
import { hentModiaContext } from '@/app/lib/modia-context-api';
import { getBekreftelser } from '../lib/bekreftelser/bekreftelse';
import { getSnapshot } from '../lib/oppslag/snapshot';
import { ForsideWrapper } from './components/ForsideWrapper';

export default async function ForsidePage() {
    const modiaContext = await hentModiaContext();
    const snapshotPromise = getSnapshot(modiaContext.fnr);
    const bekreftelserPromise = getBekreftelser(modiaContext.fnr);

    return (
        <div className={'flex flex-col max-w-3xl'}>
            <Suspense fallback={'Laster...'}>
                <ManglerPersonEllerEnhet />
                <ForsideWrapper
                    initialSnapshotPromise={snapshotPromise}
                    initialBekreftelserPromise={bekreftelserPromise}
                />
            </Suspense>
        </div>
    );
}
