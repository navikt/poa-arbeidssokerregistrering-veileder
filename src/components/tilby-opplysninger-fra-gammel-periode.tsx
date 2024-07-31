import { hentSisteArbeidssokerPeriode } from '../lib/hent-siste-arbeidssoekerperiode';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { useEffect, useState } from 'react';
import { Alert, Button } from '@navikt/ds-react';
import { ArbeidssokerPeriode } from '@navikt/arbeidssokerregisteret-utils';
import { formaterDato } from '../lib/date-utils';
import { loggAktivitet } from '../lib/amplitude';

interface Props {
    fnr: string;
    onClick(periodeId: string): void;
}

const TilbyOpplysningerFraGammelPeriode = ({ fnr, onClick }: Props) => {
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';
    const [sisteAvsluttedePeriode, setSisteAvsluttedePeriode] = useState<ArbeidssokerPeriode | null>(null);
    const [harKlikket, setHarKlikket] = useState<boolean>(false);
    const hentArbeidssoekerperioderUrl = brukerMock
        ? '/api/mocks/oppslag-arbeidssoekerperioder'
        : '/api/oppslag-arbeidssoekerperioder';

    async function apiKallArbeidssoekerperioder() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
        });

        try {
            const response = await fetch(hentArbeidssoekerperioderUrl, {
                method: 'POST',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                const sisteArbeidssoekerperiode = hentSisteArbeidssokerPeriode(data);
                if (sisteArbeidssoekerperiode.avsluttet !== null) {
                    setSisteAvsluttedePeriode(sisteArbeidssoekerperiode);
                }
            }
        } catch (err: any) {
            console.debug(err.message);
        }
    }

    useEffect(() => {
        apiKallArbeidssoekerperioder();
    }, [enableMock]);

    if (!sisteAvsluttedePeriode || harKlikket) {
        return null;
    }

    return (
        <Alert variant={'info'} className={'mb-4'}>
            <p>
                Bruker hadde en arbeidssøkerperiode som ble avsluttet{' '}
                {formaterDato(sisteAvsluttedePeriode.avsluttet.tidspunkt)}
            </p>
            <Button
                variant={'secondary'}
                onClick={() => {
                    onClick(sisteAvsluttedePeriode.periodeId);
                    setHarKlikket(true);
                    loggAktivitet({ aktivitet: 'Klikker på "Fyll inn opplysninger fra siste arbeidssøkerperiode"' });
                }}
            >
                Fyll inn opplysninger fra siste arbeidssøkerperiode
            </Button>
        </Alert>
    );
};

export default TilbyOpplysningerFraGammelPeriode;
