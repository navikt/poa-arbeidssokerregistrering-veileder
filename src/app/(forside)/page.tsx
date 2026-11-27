import { Box, Heading, Loader, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import styles from '@/app/(forside)/components/Forside.module.css';
import { ForsideWrapper } from '@/app/(forside)/components/ForsideWrapper';
import { FeedbackWidget } from '@/app/(forside)/components/lumi/FeedbackWidget';
import { HvaErNytt } from '@/components/HvaErNytt';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';
import { getKartlegging } from '@/lib/api/kartlegging';
import { getKartleggingForEnkeltperson } from '@/lib/api/kartlegging-enkeltperson';
import { getSnapshot, type SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { hentModiaContext } from '@/lib/modia-context-api';
import { isFeatureEnabled } from '@/lib/unleash/feature-flags';

export default async function ForsidePage() {
    const modiaContext = await hentModiaContext();
    const flagVisHvaSomErNyttPromise = isFeatureEnabled('arbeidssokerregistrering-for-veileder.vis-hva-er-nytt');

    const snapshotPromise = modiaContext.fnr
        ? getSnapshot(modiaContext.fnr)
        : Promise.resolve({ snapshot: null } satisfies SnapshotResult);
    const bekreftelserPromise = modiaContext.fnr
        ? getBekreftelser(modiaContext.fnr)
        : Promise.resolve({ bekreftelser: null } satisfies BekreftelseApiResult);
    const kartleggingPromise = modiaContext.fnr ? Promise.resolve(null) : getKartlegging(modiaContext.enhetId);
    const kartleggingEnkeltpersonPromise = modiaContext.fnr
        ? getKartleggingForEnkeltperson(modiaContext.fnr)
        : Promise.resolve(null);

    const flagVisHvaSomErNytt = await flagVisHvaSomErNyttPromise;

    return (
        <VStack gap='space-0'>
            <Box marginBlock='space-0 space-16'>
                <Heading level='1' size='large' className={styles.wrapAnywhere}>
                    Arbeidssøkerregisteret
                </Heading>
            </Box>
            {flagVisHvaSomErNytt && <HvaErNytt />}
            <Suspense fallback={<Loader />}>
                <ForsideWrapper
                    initialSnapshotPromise={snapshotPromise}
                    initialBekreftelserPromise={bekreftelserPromise}
                    initialKartleggingPromise={kartleggingPromise}
                    initialKartleggingEnkeltpersonPromise={kartleggingEnkeltpersonPromise}
                    initialContext={{ fnr: modiaContext.fnr, enhetId: modiaContext.enhetId }}
                />
            </Suspense>
            <FeedbackWidget />
        </VStack>
    );
}
