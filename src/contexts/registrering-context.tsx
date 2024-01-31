import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import { RegistreringState } from '../model/registrering';
import {
    DinSituasjon,
    JaEllerNei,
    SisteStillingValg,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';

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

function RegistreringProvider({ children }: { children: ReactNode }) {
    const [registrering, setRegistrering] = useState({} as RegistreringState);
    const [isValid, setIsValid] = useState(true);
    const [doValidate, setDoValidate] = useState(false);

    const contextValue = {
        registrering,
        isValid,
        doValidate,
        setDoValidate,
        setRegistrering: (data) => setRegistrering({ ...registrering, ...data }),
    };

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

        const harUgyldigeUtdanningSvar =
            ![Utdanningsnivaa.INGEN_UTDANNING, Utdanningsnivaa.INGEN_SVAR].includes(
                registrering[SporsmalId.utdanning],
            ) &&
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
