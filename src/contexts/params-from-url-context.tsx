import { createContext, useContext, useEffect, useState } from 'react';

export type UrlParams = {
    fnr?: string;
    enhetsId?: string;
};

const ParamsFromUrlContext = createContext({});

function ParamsFromUrlProvider({ children }) {
    const [params, setParams] = useState<UrlParams>({} as UrlParams);

    useEffect(() => {
        const params = Object.fromEntries(new URLSearchParams(window.location.search));
        setParams(params);
    }, []);

    return <ParamsFromUrlContext.Provider value={params}>{children}</ParamsFromUrlContext.Provider>;
}

function useParamsFromUrl() {
    const context = useContext(ParamsFromUrlContext);
    if (context === undefined) {
        throw new Error('useParamsFromUrl må brukes under en ParamsFromUrlProvider');
    }
    return context;
}

export { ParamsFromUrlProvider, useParamsFromUrl };
