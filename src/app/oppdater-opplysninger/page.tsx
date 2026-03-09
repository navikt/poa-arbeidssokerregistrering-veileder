import { Heading, Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';
import { getSisteArbeidsforholdFraAareg } from '@/lib/api/aareg';
import { getSnapshot } from '@/lib/api/oppslag-snapshot';
import { hentModiaContext } from '@/lib/modia-context-api';
import { OppdaterOpplysningerWrapper } from './components/OppdaterOpplysningerWrapper';

export default async function OppdaterOpplysningerPage() {
    const modiaContext = await hentModiaContext();

    if (!modiaContext.fnr) {
        return <ManglerPersonEllerEnhet />;
    }

    const snapshotPromise = getSnapshot(modiaContext.fnr);
    const sisteArbeidsforholdPromise = getSisteArbeidsforholdFraAareg(modiaContext.fnr);

    return (
        <div className={'flex flex-col max-w-3xl'}>
            <TilbakeTilForside sidenavn='Oppdater opplysninger' />
            <Heading size='medium' level='1' className='mb-8'>
                Oppdater opplysninger
            </Heading>
            <Suspense fallback={<Loader />}>
                <ManglerPersonEllerEnhet />
                <OppdaterOpplysningerWrapper
                    initialSnapshotPromise={snapshotPromise}
                    initialSisteArbeidsforholdPromise={sisteArbeidsforholdPromise}
                />
            </Suspense>
        </div>
    );
}
