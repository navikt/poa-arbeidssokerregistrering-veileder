import { Heading, Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { HvaErNytt } from '@/components/HvaErNytt';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { getSisteArbeidsforholdFraAareg } from '@/lib/api/aareg';
import { getSnapshot } from '@/lib/api/oppslag-snapshot';
import { hentModiaContext } from '@/lib/modia-context-api';
import { isFeatureEnabled } from '@/lib/unleash/feature-flags';
import { RegistreringsWrapper } from './components/RegistreringsWrapper';

export default async function RegistreringArbeidsokerPage() {
    const modiaContext = await hentModiaContext();

    if (!modiaContext.fnr) {
        return <ManglerPersonEllerEnhet />;
    }

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
