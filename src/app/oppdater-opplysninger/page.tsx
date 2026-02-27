import { Heading, Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ManglerPersonEllerEnhet } from '@/app/components/ManglerPersonEllerEnhet';
import { getSisteArbeidsforholdFraAareg } from '@/app/lib/api/aareg';
import { hentModiaContext } from '@/app/lib/modia-context-api';
import { getSnapshot } from '@/app/lib/oppslag/snapshot';
import TilbakeTilForside from '@/components/tilbake-til-forside';
import { OppdaterOpplysningerWrapper } from './components/OppdaterOpplysningerWrapper';

export default async function OppdaterOpplysningerPage() {
    const modiaContext = await hentModiaContext();
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
