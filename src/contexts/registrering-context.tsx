import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash'

import { RegistreringState } from '../model/registrering';
import { SporsmalId } from '../model/sporsmal';

interface RegistreringContextType {
    registrering: RegistreringState;
    isValid: boolean;
    doValidate: boolean;
    setRegistrering: (data: any) => void;
    setDoValidate: (data: boolean) => void;
}

const pakrevdeSvar = [
    SporsmalId.andreForhold,
    SporsmalId.dinSituasjon,
    SporsmalId.helseHinder,
    SporsmalId.utdanningBestatt,
    SporsmalId.utdanningGodkjent,
    SporsmalId.utdanning
]

const RegistreringContext = createContext<RegistreringContextType>({
    registrering: {} as RegistreringState,
    isValid: true,
    doValidate: false,
    setRegistrering: () => {},
    setDoValidate: () => false
});

function RegistreringProvider({ children }: { children: ReactNode }) {
    const [registrering, setRegistrering] = useState({} as RegistreringState);
    const [isValid, setIsValid] = useState(true)
    const [doValidate, setDoValidate] = useState(false)

    const contextValue = {
        registrering,
        isValid,
        doValidate,
        setDoValidate,
        setRegistrering: (data) => setRegistrering({...registrering, ...data})
    };

    useEffect(() => {
        const altOk = isEqual(Object.keys(registrering).sort(), pakrevdeSvar.sort())
        setIsValid(altOk)
    }, [registrering])

    return <RegistreringContext.Provider value={contextValue}>{children}</RegistreringContext.Provider>
}

function useRegistrering () {
    const context = useContext(RegistreringContext);

    if (context === undefined) {
        throw new Error('useRegistreringContext må brukes under en RegistreringProvider');
    }

    return context;
}

export { RegistreringProvider, useRegistrering };
