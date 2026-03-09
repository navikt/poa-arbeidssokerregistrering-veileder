import { Heading } from '@navikt/ds-react';
import { Suspense } from 'react';
import { TilbakeTilForside } from '@/app/components/tilbake-til-forside';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { getPerioder } from '@/lib/api/oppslag-perioder';
import { hentModiaContext } from '@/lib/modia-context-api';
import { ManglerPersonEllerEnhet } from '../components/ManglerPersonEllerEnhet';
import { HistorikkWrapper } from './components/HistorikkWrapper';

export default async function HistorikkPage() {
    const modiaContext = await hentModiaContext();
    const perioderPromise = getPerioder(modiaContext.fnr);

    return (
        <div>
            <TilbakeTilForside sidenavn='Arbeidssøkerhistorikk' />
            <Heading size={'large'} className='mb-4'>
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
