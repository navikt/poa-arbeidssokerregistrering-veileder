import { Heading } from '@navikt/ds-react';
import { Suspense } from 'react';
import { hentModiaContext } from '@/app/lib/modia-context-api';
import { getPerioder } from '@/app/lib/oppslag/perioder';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import TilbakeTilForside from '@/components/tilbake-til-forside';
import { ManglerPersonEllerEnhet } from '../components/ManglerPersonEllerEnhet';
import { HistorikkWrapper } from './components/HistorikkWrapper';

export default async function HistorikkPage() {
    const modiaContext = await hentModiaContext();
    const perioderPromise = getPerioder(modiaContext.fnr);

    return (
        <div>
            <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
            <Heading size={'large'} className="mb-4">
                Historikk for arbeidssøker
            </Heading>
            <div className={'flex flex-col max-w-3xl'}>
                <Suspense fallback={<LoaderSkeleton />}>
                    <ManglerPersonEllerEnhet />
                    <HistorikkWrapper initialPerioderPromise={perioderPromise} />
                </Suspense>
            </div>
        </div>
    );
}
