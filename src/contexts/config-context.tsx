import { createContext, ReactNode, useContext } from 'react';

import { fetcher } from '../lib/api-utils';
import { Config } from '../model/config';
import useSWRImmutable from 'swr/immutable';

type uninitializedConfig = {};

const ConfigContext = createContext<Config | uninitializedConfig>({});

function ConfigProvider({ children }: { children: ReactNode }) {
    const { data } = useSWRImmutable('/api/config/', fetcher);

    return <ConfigContext.Provider value={data ?? {}}>{children}</ConfigContext.Provider>;
}

function useConfig() {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig må brukes under en ConfigProvider');
    }

    return context;
}

export { ConfigProvider, useConfig };
