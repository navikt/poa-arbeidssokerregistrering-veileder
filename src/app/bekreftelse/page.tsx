import { Heading } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/app/components/ManglerPersonEllerEnhet';
import { TilbakeTilForside } from '@/app/components/tilbake-til-forside';
import { getBekreftelser } from '@/app/lib/api/bekreftelse';
import { hentModiaContext } from '@/app/lib/modia-context-api';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { BekreftelseWrapper } from './components/BekreftelseWrapper';

export default async function BekreftelsePage() {
    const modiaContext = await hentModiaContext();
    const bekreftelserPromise = getBekreftelser(modiaContext.fnr);

    return (
        <>
            <TilbakeTilForside sidenavn='Bekreftelse' />
            <Heading size={'large'}>Bekreftelse</Heading>
            <div className={'flex flex-col max-w-3xl'}>
                <Suspense fallback={<LoaderSkeleton />}>
                    <ManglerPersonEllerEnhet />
                    <BekreftelseWrapper initialBekreftelserPromise={bekreftelserPromise} />
                </Suspense>
            </div>
        </>
    );
}
