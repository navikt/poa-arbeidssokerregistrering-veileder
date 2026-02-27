import { Alert } from '@navikt/ds-react';
import { use } from 'react';
import type { SisteArbeidsforholdResult } from '@/app/lib/api/aareg';
import type { SnapshotResult } from '@/app/lib/oppslag/snapshot';
import { mapOpplysningerTilInitState } from './mapSnapshotOpplysningerTilRegistrering';
import { OpplysningerSkjema } from './OpplysningerSkjema';

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

    return <OpplysningerSkjema initState={initState} fnr={snapshot?.identitetsnummer} />;
}
export { OppdaterOpplysninger };
