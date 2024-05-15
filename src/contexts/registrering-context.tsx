import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import { RegistreringState } from '../model/registrering';
import {
    DinSituasjon,
    hentSisteArbeidssokerPeriode,
    hentSisteOpplysningerOmArbeidssoker,
    JaEllerNei,
    SisteStillingValg,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';
import { useFeatureToggles } from './featuretoggle-context';
import { useConfig } from './config-context';
import { Config } from '../model/config';
import { useParamsFromContext } from './params-from-context';

interface RegistreringContextType {
    registrering: RegistreringState;
    isValid: boolean;
    doValidate: boolean;
    setRegistrering: (data: Partial<RegistreringState>) => void;
    setDoValidate: (data: boolean) => void;
}

const pakrevdeSvarUnntattStilling = [
    SporsmalId.andreForhold,
    SporsmalId.dinSituasjon,
    SporsmalId.helseHinder,
    SporsmalId.utdanningBestatt,
    SporsmalId.utdanningGodkjent,
    SporsmalId.utdanning,
];

const muligeStillingsSvar = [SporsmalId.sisteJobb, SporsmalId.sisteStilling];

const RegistreringContext = createContext<RegistreringContextType>({
    registrering: {} as RegistreringState,
    isValid: true,
    doValidate: false,
    setRegistrering: () => {},
    setDoValidate: () => false,
});

function RegistreringProvider({
    children,
    hentTidligereOpplysninger,
}: {
    children: ReactNode;
    hentTidligereOpplysninger?: boolean;
}) {
    const [registrering, setRegistrering] = useState({} as RegistreringState);
    const [isValid, setIsValid] = useState(true);
    const [doValidate, setDoValidate] = useState(false);
    const { toggles } = useFeatureToggles();
    const brukNyInngang = toggles['arbeidssokerregistrering.bruk-ny-inngang'];
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';
    const [errorArbeidssoekerperioder, setErrorArbeidssoekerperioder] = useState<any>(undefined);
    const [sisteArbeidssoekerperiode, setSisteArbeidssoekerperiode] = useState<any>({});
    const [errorOpplysningerOmArbeidssoeker, setErrorOpplysningerOmArbeidssoeker] = useState<any>(undefined);
    const [sisteOpplysningerOmArbeidssoeker, setSisteOpplysningerOmArbeidssoeker] = useState<any>(undefined);
    const hentArbeidssoekerperioderUrl = brukerMock
        ? '/api/mocks/oppslag-arbeidssoekerperioder'
        : '/api/oppslag-arbeidssoekerperioder';
    const hentOpplysningerOmArbeidssoekerUrl = brukerMock
        ? '/api/mocks/oppslag-opplysninger'
        : '/api/oppslag-opplysninger';

    const contextValue = {
        registrering,
        isValid,
        doValidate,
        setDoValidate,
        setRegistrering: (data) => setRegistrering({ ...registrering, ...data }),
    };

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

    useEffect(() => {
        if (hentTidligereOpplysninger) {
            console.log('henter opplysnigner');
            apiKallArbeidssoekerperioder();
            apiKallOpplysningerOmArbeidssoeker();
            //console.log((JSON.stringify( sisteOpplysningerOmArbeidssoeker)))
        }
    }, [hentTidligereOpplysninger]);

    useEffect(() => {
        const skalValidereSisteJobb = [
            DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
            DinSituasjon.JOBB_OVER_2_AAR,
            DinSituasjon.USIKKER_JOBBSITUASJON,
        ].includes(registrering.dinSituasjon);

        const altOkUnntattStilling = isEqual(
            Object.keys(registrering)
                .filter((key) => pakrevdeSvarUnntattStilling.includes(key as SporsmalId))
                .sort(),
            pakrevdeSvarUnntattStilling.sort(),
        );
        const stillingOK =
            Object.keys(registrering).filter((key) => muligeStillingsSvar.includes(key as SporsmalId)).length > 0;

        const sisteJobbOK = skalValidereSisteJobb
            ? [SisteStillingValg.HAR_HATT_JOBB, SisteStillingValg.HAR_IKKE_HATT_JOBB].includes(
                  registrering.sisteStilling,
              )
            : true;

        const utdanningsNivaaerSomIkkeKreverGodkjentOgBestaatt = brukNyInngang
            ? [Utdanningsnivaa.INGEN_UTDANNING, Utdanningsnivaa.INGEN_SVAR, Utdanningsnivaa.GRUNNSKOLE]
            : [Utdanningsnivaa.INGEN_UTDANNING, Utdanningsnivaa.INGEN_SVAR];

        const harUgyldigeUtdanningSvar =
            !utdanningsNivaaerSomIkkeKreverGodkjentOgBestaatt.includes(registrering[SporsmalId.utdanning]) &&
            registrering[SporsmalId.utdanningGodkjent] === UtdanningGodkjentValg.INGEN_SVAR &&
            registrering[SporsmalId.utdanningBestatt] === JaEllerNei.INGEN_SVAR;
        const altOK = altOkUnntattStilling && stillingOK && sisteJobbOK && !harUgyldigeUtdanningSvar;
        setIsValid(altOK);
    }, [registrering]);

    return <RegistreringContext.Provider value={contextValue}>{children}</RegistreringContext.Provider>;
}

function useRegistrering() {
    const context = useContext(RegistreringContext);

    if (context === undefined) {
        throw new Error('useRegistreringContext må brukes under en RegistreringProvider');
    }

    return context;
}

export { RegistreringProvider, useRegistrering };
