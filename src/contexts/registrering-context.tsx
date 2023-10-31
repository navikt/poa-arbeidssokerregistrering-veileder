import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash'

interface RegistreringContextType {
    registrering: any;
    isValid: boolean;
    setRegistrering: (data:any) => void;
}

const pakrevdeSvar = ['andreForhold', 'dinSituasjon', 'helseHinder', 'utdanningBestatt', 'utdanningGodkjent', 'utdanning']

const RegistreringContext = createContext<RegistreringContextType>({
    registrering: {},
    isValid: true,
    setRegistrering: () => {},
});

function RegistreringProvider({ children }: { children: ReactNode }) {
    const [registrering, setRegistrering] = useState({});
    const [isValid, setIsValid] = useState(true)

    const contextValue = {
        registrering,
        isValid,
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
