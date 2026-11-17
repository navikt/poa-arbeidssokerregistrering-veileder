import { Box, Heading, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { LoaderSkeleton } from '@/app/tidslinjer/components/LoaderSkeleton';
import { TidslinjeWrapper } from '@/app/tidslinjer/components/TidslinjeWrapper';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { getPerioder } from '@/lib/api/oppslag-perioder';
import { hentModiaContext } from '@/lib/modia-context-api';

export default async function TidslinjerPage() {
    const modiaContext = await hentModiaContext();
    const perioderPromise = getPerioder(modiaContext.fnr);

    return (
        <div>
            <TilbakeTilForside sidenavn='Arbeidssøkerhistorikk' />
            <Box marginBlock='space-0 space-16'>
                <Heading size={'large'}>Tidslinjer for arbeidssøker</Heading>
            </Box>
            <VStack>
                <Suspense fallback={<LoaderSkeleton />}>
                    <TidslinjeWrapper initialPerioderPromise={perioderPromise} />
                </Suspense>
            </VStack>
        </div>
    );
}
