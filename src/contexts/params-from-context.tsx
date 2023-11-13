import { createContext, useContext, useEffect, useState } from 'react';

export type ContextParams = {
    fnr?: string;
    enhetId?: string;
};

const ParamsFromContext = createContext<ContextParams>({});

function ParamsFromContextProvider({ children }) {
    const [params, setParams] = useState<ContextParams>({} as ContextParams);

    const hentContextFraModia = async () => {
        const contextFraModia = await fetch('/api/hent-modia-context/').then((res) => res.json());
        const { aktivBruker, aktivEnhet } = contextFraModia;

        setParams({
            fnr: aktivBruker,
            enhetId: aktivEnhet,
        });
    };

    useEffect(() => {
        hentContextFraModia();
    }, []);

    return <ParamsFromContext.Provider value={params}>{children}</ParamsFromContext.Provider>;
}

function useParamsFromContext() {
    const context = useContext(ParamsFromContext);
    if (context === undefined) {
        throw new Error('useParamsFromUrl må brukes under en ParamsFromContextProvider');
    }
    return context;
}

export { ParamsFromContextProvider, useParamsFromContext };
