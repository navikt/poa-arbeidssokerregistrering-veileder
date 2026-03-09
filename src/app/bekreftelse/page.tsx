import { Heading } from '@navikt/ds-react';
import { Suspense } from 'react';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { getBekreftelser } from '@/lib/api/bekreftelse';
import { hentModiaContext } from '@/lib/modia-context-api';
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
