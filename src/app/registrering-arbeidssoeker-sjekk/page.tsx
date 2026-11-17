import { Box, Heading, Loader, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { hentModiaContext } from '@/lib/modia-context-api';
import { kanStartePeriode } from '../../lib/api/inngang-kan-starte-periode';
import { RegistreringSjekkWrapper } from './components/RegistreringSjekkWrapper';

export default async function ForsidePage() {
    const modiaContext = await hentModiaContext();
    const kanStartePeriodePromise = kanStartePeriode(modiaContext.fnr);

    return (
        <VStack>
            <TilbakeTilForside sidenavn='Arbeidssøkerregistrering' />
            <Box marginBlock='space-0 space-32' asChild>
                <Heading level='1' size='large'>
                    Arbeidssøkerregistrering
                </Heading>
            </Box>
            <Suspense fallback={<Loader />}>
                <RegistreringSjekkWrapper initialKanRegistreresPromise={kanStartePeriodePromise} />
            </Suspense>
        </VStack>
    );
}
