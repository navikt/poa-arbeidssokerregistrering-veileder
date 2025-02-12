import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

const routesSomIkkeSkalRefreshes = [
    '/avslutt-arbeidssoekerperiode',
    '/sykmeldtoppfoelging',
    '/slett-arbeidssoekerperiode',
    '/historikk',
    '/registrering-arbeidssoeker-sjekk',
];

function ParamsFromContextProvider({ children }) {
    const [params, setParams] = useState<ContextParams>({} as ContextParams);
    const router = useRouter();

    const updateParams = (data: ContextParams) => {
        setParams((state) => ({ ...state, ...data }));
        if (!routesSomIkkeSkalRefreshes.includes(router.pathname)) {
            router.push('/');
        }
    };

    const hentContextFraModia = async () => {
        try {
            const contextFraModia = await fetch('/api/hent-modia-context/').then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error(res.statusText);
            });
            const { aktivBruker, aktivEnhet } = contextFraModia;

            setParams({
                fnr: aktivBruker,
                enhetId: aktivEnhet,
            });
        } catch (err) {
            console.error('/api/hent-modia-context', err);
        }
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
