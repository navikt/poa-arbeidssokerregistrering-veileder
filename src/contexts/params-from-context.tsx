import { createContext, useContext, useEffect, useState } from 'react';

export type ContextParams = {
    fnr?: string;
    enhetId?: string;
};

interface ParamsContextType {
    params: ContextParams;
    setParams: (data: any) => void;
}

const ParamsFromContext = createContext<ParamsContextType>({
    params: {} as ContextParams,
    setParams: () => {},
});

function ParamsFromContextProvider({ children }) {
    const [params, setParams] = useState<ContextParams>({} as ContextParams);

    const updateParams = (data: ContextParams) => {
        setParams({ ...params, ...data });
    };

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

    const contextValue = {
        params,
        setParams: (data: ContextParams) => updateParams(data),
    };

    return <ParamsFromContext.Provider value={contextValue}>{children}</ParamsFromContext.Provider>;
}

function useParamsFromContext() {
    const context = useContext(ParamsFromContext);
    if (context === undefined) {
        throw new Error('useParamsFromUrl må brukes under en ParamsFromContextProvider');
    }
    return context;
}

export { ParamsFromContextProvider, useParamsFromContext };
