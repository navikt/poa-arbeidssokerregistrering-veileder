import { Heading, Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { HvaErNytt } from '@/app/components/HvaErNytt';
import { ManglerPersonEllerEnhet } from '@/app/components/ManglerPersonEllerEnhet';
import { getSisteArbeidsforholdFraAareg } from '@/app/lib/api/aareg';
import { hentModiaContext } from '@/app/lib/modia-context-api';
import { getSnapshot } from '@/app/lib/oppslag/snapshot';
import { isFeatureEnabled } from '@/app/lib/unleash/feature-flags';
import TilbakeTilForside from '@/components/tilbake-til-forside';
import { RegistreringsWrapper } from './components/RegistreringsWrapper';

export default async function RegistreringArbeidsokerPage() {
    const modiaContext = await hentModiaContext();
    const flagVisHvaSomErNyttPromise = isFeatureEnabled('arbeidssokerregistrering-for-veileder.vis-hva-er-nytt');
    const snapshotPromise = getSnapshot(modiaContext.fnr);
    const sisteArbeidsforholdPromise = getSisteArbeidsforholdFraAareg(modiaContext.fnr);
    const flagVisHvaSomErNytt = await flagVisHvaSomErNyttPromise;

    return (
        <>
            <TilbakeTilForside sidenavn='Arbeidssøkerregistrering' />
            <Heading size='medium' level='1' className='mb-8'>
                Arbeidssøkerregistrering
            </Heading>
            {flagVisHvaSomErNytt && <HvaErNytt />}

            <Suspense fallback={<Loader />}>
                <ManglerPersonEllerEnhet />
                <RegistreringsWrapper
                    initialSnapshotPromise={snapshotPromise}
                    initialSisteArbeidsforholdPromise={sisteArbeidsforholdPromise}
                />
            </Suspense>
        </>
    );
}
