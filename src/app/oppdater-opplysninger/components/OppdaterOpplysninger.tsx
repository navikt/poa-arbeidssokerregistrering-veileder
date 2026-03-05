import { Alert } from '@navikt/ds-react';
import { use } from 'react';
import { mapOpplysningerTilInitState } from '@/app/components/skjema/mapSnapshotOpplysningerTilRegistrering';
import { OpplysningerSkjema } from '@/app/components/skjema/OpplysningerSkjema';
import type { SisteArbeidsforholdResult } from '@/app/lib/api/aareg';
import type { SnapshotResult } from '@/app/lib/oppslag/snapshot';

type OppdaterOpplysningerProps = {
    snapshotPromise: Promise<SnapshotResult>;
    sisteArbeidsforholdPromise: Promise<SisteArbeidsforholdResult>;
};

function OppdaterOpplysninger({ snapshotPromise, sisteArbeidsforholdPromise }: OppdaterOpplysningerProps) {
    const { snapshot, error: snapshotError, notFound } = use(snapshotPromise);
    const aaregResult = use(sisteArbeidsforholdPromise);

    if (snapshotError || notFound) {
        return <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere</Alert>;
    }

    const initState = mapOpplysningerTilInitState(snapshot?.opplysning, aaregResult);

    return <OpplysningerSkjema initState={initState} mode='oppdater' />;
}
export { OppdaterOpplysninger };
