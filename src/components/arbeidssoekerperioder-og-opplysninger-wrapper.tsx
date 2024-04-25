import { useEffect, useState } from 'react';
import {
    hentSisteArbeidssokerPeriode,
    hentSisteOpplysningerOmArbeidssoker,
    hentSisteProfilering,
} from '@navikt/arbeidssokerregisteret-utils';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

import ArbeidssoekerperiodeStatus from './arbeidssoekerperiodestatus';
import OpplysningerOmArbeidssoeker from './opplysninger-om-arbeidssoeker';
import Profilering from './profilering';

function ArbeidssoekerperioderOgOpplysningerWrapper() {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr, enhetId } = params;
    const brukerMock = enableMock === 'enabled';
    const [errorArbeidssoekerperioder, setErrorArbeidssoekerperioder] = useState<any>(undefined);
    const [sisteArbeidssoekerperiode, setSisteArbeidssoekerperiode] = useState<any>({});
    const [errorOpplysningerOmArbeidssoeker, setErrorOpplysningerOmArbeidssoeker] = useState<any>(undefined);
    const [sisteOpplysningerOmArbeidssoeker, setSisteOpplysningerOmArbeidssoeker] = useState<any>(undefined);
    const [errorProfileringer, setErrorProfileringer] = useState<any>(undefined);
    const [sisteProfilering, setSisteProfilering] = useState<any>(undefined);

    const hentArbeidssoekerperioderUrl = brukerMock
        ? '/api/mocks/oppslag-arbeidssoekerperioder'
        : '/api/oppslag-arbeidssoekerperioder';

    const hentOpplysningerOmArbeidssoekerUrl = brukerMock
        ? '/api/mocks/oppslag-opplysninger'
        : '/api/oppslag-opplysninger';

    const hentProfileringerUrl = brukerMock ? '/api/mocks/oppslag-profileringer' : '/api/oppslag-profileringer';

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
                setSisteArbeidssoekerperiode(sisteArbeidssoekerperiode);
            }
        } catch (err: unknown) {
            setErrorArbeidssoekerperioder(err);
        }
    }

    async function apiKallOpplysningerOmArbeidssoeker() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
            periodeId: sisteArbeidssoekerperiode.periodeId,
        });

        try {
            const response = await fetch(hentOpplysningerOmArbeidssoekerUrl, {
                method: 'POST',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                const sisteOpplysninger = hentSisteOpplysningerOmArbeidssoker(data);
                setSisteOpplysningerOmArbeidssoeker(sisteOpplysninger);
            }
        } catch (err: unknown) {
            setErrorOpplysningerOmArbeidssoeker(err);
        }
    }

    async function apiKallProfilering() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
            periodeId: sisteArbeidssoekerperiode.periodeId,
        });

        try {
            const response = await fetch(hentProfileringerUrl, {
                method: 'POST',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                const sisteProfilering = hentSisteProfilering(data);
                setSisteProfilering(sisteProfilering);
            }
        } catch (err: unknown) {
            setErrorProfileringer(err);
        }
    }

    useEffect(() => {
        if (fnr && enhetId) {
            apiKallArbeidssoekerperioder();
        }
    }, [fnr, enhetId]);

    useEffect(() => {
        if (sisteArbeidssoekerperiode) {
            apiKallOpplysningerOmArbeidssoeker();
            apiKallProfilering();
        }
    }, [sisteArbeidssoekerperiode]);

    if (!fnr || !enhetId) return null;

    return (
        <>
            <ArbeidssoekerperiodeStatus sisteArbeidssoekerperiode={sisteArbeidssoekerperiode} />
            <OpplysningerOmArbeidssoeker sisteOpplysningerOmArbeidssoeker={sisteOpplysningerOmArbeidssoeker} />
            <Profilering sisteProfilering={sisteProfilering} />
        </>
    );
}

export default ArbeidssoekerperioderOgOpplysningerWrapper;
