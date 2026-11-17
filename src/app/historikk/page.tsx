import { Box, Heading, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { getPerioder } from '@/lib/api/oppslag-perioder';
import { hentModiaContext } from '@/lib/modia-context-api';
import { HistorikkWrapper } from './components/HistorikkWrapper';

export default async function HistorikkPage() {
    const modiaContext = await hentModiaContext();
    const perioderPromise = getPerioder(modiaContext.fnr);

    return (
        <div className='historikk-side'>
            <TilbakeTilForside sidenavn='Arbeidssøkerhistorikk' />
            <Box marginBlock='space-0 space-16'>
                <Heading size={'large'}>Historikk for arbeidssøker</Heading>
            </Box>
            <VStack>
                <Suspense fallback={<LoaderSkeleton />}>
                    <HistorikkWrapper initialPerioderPromise={perioderPromise} />
                </Suspense>
            </VStack>
        </div>
    );
}
