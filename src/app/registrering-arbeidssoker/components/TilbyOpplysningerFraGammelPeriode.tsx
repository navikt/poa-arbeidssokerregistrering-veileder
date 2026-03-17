'use client';

import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Alert, Button } from '@navikt/ds-react';
import { formaterDato } from '@/lib/date-utils';
import { loggAktivitet } from '@/lib/tracking';

type TilbyOpplysningerFraGammelPeriodeProps = {
    snapshot: Snapshot | null;
    onBrukSistPeriode: () => void;
};

function TilbyOpplysningerFraGammelPeriode({ snapshot, onBrukSistPeriode }: TilbyOpplysningerFraGammelPeriodeProps) {
    // TODO: skal du kunne hente fra pågående periode, aka kan du registrere ny periode mens du har en pågående?
    // Dette sjekkes vel også i registrering-arbeidssoeker-sjekk
    if (!snapshot || !snapshot.avsluttet) return null;

    return (
        <Alert variant={'info'} className={'mb-4'}>
            <p>Bruker hadde en arbeidssøkerperiode som ble avsluttet {formaterDato(snapshot.avsluttet?.tidspunkt)}</p>
            <Button
                variant={'secondary'}
                onClick={() => {
                    onBrukSistPeriode();
                    loggAktivitet({ aktivitet: 'Klikker på "Fyll inn opplysninger fra siste arbeidssøkerperiode"' });
                }}
            >
                Fyll inn opplysninger fra siste arbeidssøkerperiode
            </Button>
        </Alert>
    );
}
export { TilbyOpplysningerFraGammelPeriode };
