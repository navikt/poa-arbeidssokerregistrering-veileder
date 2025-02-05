import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert } from '@navikt/ds-react';
import {
    ArbeidssokerPeriode,
    hentSisteArbeidssokerPeriode,
    hentSisteOpplysningerOmArbeidssoker,
    hentSisteProfilering,
    SamletInformasjon,
} from '@navikt/arbeidssokerregisteret-utils';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

import ArbeidssoekerperiodeStatus from './arbeidssoekerperiodestatus';
import OpplysningerOmArbeidssoeker from './opplysninger-om-arbeidssoeker';
import Profilering from './profilering';
import OppdaterOpplysningerKnapp from './oppdater-opplysninger-knapp';

function ArbeidssoekerperioderOgOpplysningerWrapper() {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr, enhetId } = params;
    const brukerMock = enableMock === 'enabled';
    const [samletInformasjon, settSamletInformasjon] = useState<SamletInformasjon | null>(null);
    const [errorSamletInformasjon, settErrorSamletInformasjon] = useState<any>();
    const [errorBehovsvurdering, setErrorBehovsvurdering] = useState<any>(undefined);
    const [sisteBehovsvurdering, setSisteBehovsvurdering] = useState<any>(undefined);
    const [harSjekketArbeidssoekerperioder, setHarSjekketArbeidssoekerperioder] = useState<boolean>(false);

    const hentArbeidssoekerInformasjonUrl = brukerMock
        ? '/api/mocks/oppslag-samlet-informasjon'
        : '/api/oppslag-samlet-informasjon';
    const hentBehovsvurderingUrl = brukerMock ? '/api/mocks/behovsvurdering' : '/api/behovsvurdering';

    async function apiKallBehovsvurdering() {
        const payload = JSON.stringify({
            foedselsnummer: fnr,
        });

        try {
            const response = await fetch(hentBehovsvurderingUrl, {
                method: 'POST',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSisteBehovsvurdering(data);
            }
        } catch (err: unknown) {
            setErrorBehovsvurdering(err);
        }
    }

    async function apiKallArbeidssoekerInformasjon() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
        });

        try {
            const response = await fetch(hentArbeidssoekerInformasjonUrl, {
                method: 'POST',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const data: SamletInformasjon = await response.json();
                settSamletInformasjon(data);
                setHarSjekketArbeidssoekerperioder(true);
            }
        } catch (err: unknown) {
            settErrorSamletInformasjon(err);
        }
    }

    useEffect(() => {
        if (fnr && enhetId) {
            setErrorBehovsvurdering(undefined);
            setSisteBehovsvurdering(undefined);
            setHarSjekketArbeidssoekerperioder(false);
            settErrorSamletInformasjon(undefined);
            settSamletInformasjon(null);
            apiKallArbeidssoekerInformasjon();
            apiKallBehovsvurdering();
        }
    }, [fnr, enhetId]);

    if (!fnr || !enhetId) return null;
    const sisteArbeidssoekerperiode = hentSisteArbeidssokerPeriode(samletInformasjon?.arbeidssoekerperioder ?? []);
    const sisteOpplysningerOmArbeidssoeker = hentSisteOpplysningerOmArbeidssoker(
        samletInformasjon?.opplysningerOmArbeidssoeker ?? [],
    );
    const sisteProfilering = hentSisteProfilering(samletInformasjon?.profilering ?? []);
    const aktivPeriode = sisteArbeidssoekerperiode?.avsluttet === null && sisteArbeidssoekerperiode !== undefined;
    const harOpplysninger = sisteOpplysningerOmArbeidssoeker?.opplysningerOmArbeidssoekerId;
    const harIngenArbeidssoekerperioder = samletInformasjon?.arbeidssoekerperioder.length === 0;

    return (
        <>
            {harSjekketArbeidssoekerperioder && (
                <ArbeidssoekerperiodeStatus
                    sisteArbeidssoekerperiode={sisteArbeidssoekerperiode}
                    perioder={samletInformasjon?.arbeidssoekerperioder}
                    harIngenArbeidssoekerperioder={harIngenArbeidssoekerperioder}
                />
            )}
            <OpplysningerOmArbeidssoeker
                sisteOpplysningerOmArbeidssoeker={sisteOpplysningerOmArbeidssoeker}
                behovsvurdering={sisteBehovsvurdering}
                aktivPeriode={aktivPeriode}
                harIngenArbeidssoekerperioder={harIngenArbeidssoekerperioder}
            />
            {aktivPeriode && !harOpplysninger && (
                <OppdaterOpplysningerKnapp
                    sisteArbeidssoekerperiodeId={sisteArbeidssoekerperiode.periodeId}
                    knappeTekst="Legg til opplysninger"
                />
            )}
            {aktivPeriode && (
                <ErrorBoundary fallback={<Alert variant="warning">Visning av siste profilering feilet</Alert>}>
                    <Profilering sisteProfilering={sisteProfilering} />
                </ErrorBoundary>
            )}
        </>
    );
}

export default ArbeidssoekerperioderOgOpplysningerWrapper;
