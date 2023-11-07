import { createContext, useContext, useEffect, useState } from 'react';

export type ContextParams = {
    fnr?: string;
    enhetsId?: string;
};

const ParamsFromContext = createContext<ContextParams>({});

function ParamsFromContextProvider({ children }) {
    const [params, setParams] = useState<ContextParams>({} as ContextParams);

    useEffect(() => {
        const params = Object.fromEntries(new URLSearchParams(window.location.search));
        setParams(params);
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
