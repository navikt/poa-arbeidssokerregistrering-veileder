import { Alert } from '@navikt/ds-react';
import { use, useState } from 'react';
import { mapOpplysningerTilInitState } from '@/app/components/skjema/mapSnapshotOpplysningerTilRegistrering';
import { OpplysningerSkjema } from '@/app/components/skjema/OpplysningerSkjema';
import type { SisteArbeidsforholdResult } from '@/app/lib/api/aareg';
import type { SnapshotResult } from '@/app/lib/oppslag/snapshot';
import { TilbyOpplysningerFraGammelPeriode } from './TilbyOpplysningerFraGammelPeriode';

type RegistrerArbeidssoekerProps = {
    snapshotPromise: Promise<SnapshotResult>;
    sisteArbeidsforholdPromise: Promise<SisteArbeidsforholdResult>;
};

function RegistrerArbeidssoeker({ snapshotPromise, sisteArbeidsforholdPromise }: RegistrerArbeidssoekerProps) {
    const { snapshot, error: snapshotError } = use(snapshotPromise);
    const aaregResult = use(sisteArbeidsforholdPromise);
    const [useGammelPeriode, setUseGammelPeriode] = useState(false);

    const fetchCurrentOpplysninger = () => {
        setUseGammelPeriode(true);
    };
    const initSkjemaState = useGammelPeriode ? mapOpplysningerTilInitState(snapshot?.opplysning, aaregResult) : {};

    if (snapshotError) {
        return <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere</Alert>;
    }
    // TODO: Burde vi ikke gjøre en sjekk om du har lov å registrere her?
    // Altså egentlig det samme som vi gjør i registrering-arbeissoeker-sjekk...
    // Har du snapshot som ikke er null, OG du ikke har avsluttet, ja da har du pågående
    // og kan ikke registrere en ny?

    return (
        <div>
            <TilbyOpplysningerFraGammelPeriode snapshot={snapshot} onBrukSistPeriode={fetchCurrentOpplysninger} />
            <OpplysningerSkjema
                key={useGammelPeriode ? 'bruk-snapshot' : 'blank'}
                initState={initSkjemaState}
                mode='registrering'
            />
        </div>
    );
}
export { RegistrerArbeidssoeker };
