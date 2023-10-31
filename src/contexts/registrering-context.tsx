import { createContext, ReactNode, useContext, useState } from 'react';

interface RegistreringContextType {
    registrering: any;
    setRegistrering: (data:any) => void;
}

const RegistreringContext = createContext<RegistreringContextType>({
    registrering: {},
    setRegistrering: () => {},
});

function RegistreringProvider({ children }: { children: ReactNode }) {
    const [registrering, setRegistrering] = useState({});

    const contextValue = {
        registrering,
        setRegistrering: (data) => setRegistrering({...registrering, ...data})
    };

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
