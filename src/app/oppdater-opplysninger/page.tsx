import { Box, Heading, Loader, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { getSisteArbeidsforholdFraAareg } from '@/lib/api/aareg';
import { getSnapshot } from '@/lib/api/oppslag-snapshot';
import { hentModiaContext } from '@/lib/modia-context-api';
import { OppdaterOpplysningerWrapper } from './components/OppdaterOpplysningerWrapper';

export default async function OppdaterOpplysningerPage() {
    const modiaContext = await hentModiaContext();
    const snapshotPromise = getSnapshot(modiaContext.fnr);
    const sisteArbeidsforholdPromise = getSisteArbeidsforholdFraAareg(modiaContext.fnr);

    return (
        <VStack>
            <TilbakeTilForside sidenavn='Oppdater opplysninger' />
            <Box marginBlock='space-0 space-32'>
                <Heading size='medium' level='1'>
                    Oppdater opplysninger
                </Heading>
            </Box>
            <Suspense fallback={<Loader />}>
                <OppdaterOpplysningerWrapper
                    initialSnapshotPromise={snapshotPromise}
                    initialSisteArbeidsforholdPromise={sisteArbeidsforholdPromise}
                />
            </Suspense>
        </VStack>
    );
}
