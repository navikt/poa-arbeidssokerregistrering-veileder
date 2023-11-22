import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import { RegistreringState } from '../model/registrering';
import { SporsmalId } from '../model/sporsmal';

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
        const altOkUnntattStilling = isEqual(
            Object.keys(registrering)
                .filter((key) => pakrevdeSvarUnntattStilling.includes(key as SporsmalId))
                .sort(),
            pakrevdeSvarUnntattStilling.sort(),
        );
        const stillingOK =
            Object.keys(registrering).filter((key) => muligeStillingsSvar.includes(key as SporsmalId)).length > 0;
        const altOK = altOkUnntattStilling && stillingOK;
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
