import { Heading } from '@navikt/ds-react';
import { Suspense } from 'react';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { TidslinjeWrapper } from '@/app/tidslinjer/components/TidslinjeWrapper';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { getPerioder } from '@/lib/api/oppslag-perioder';
import { hentModiaContext } from '@/lib/modia-context-api';

export default async function TidslinjerPage() {
    const modiaContext = await hentModiaContext();
    const perioderPromise = getPerioder(modiaContext.fnr);

    return (
        <div>
            <TilbakeTilForside sidenavn='Arbeidssøkerhistorikk' />
            <Heading size={'large'} className='mb-4'>
                Tidslinjer for arbeidssøker
            </Heading>
            <div className={'flex flex-col max-w-3xl'}>
                <Suspense fallback={<LoaderSkeleton />}>
                    <ManglerPersonEllerEnhet />
                    <TidslinjeWrapper initialPerioderPromise={perioderPromise} />
                </Suspense>
            </div>
        </div>
    );
}
