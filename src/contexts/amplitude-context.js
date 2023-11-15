import { createContext, useContext, useEffect } from 'react';

import { useConfig } from './config-context';

import { initAmplitude, logAmplitudeEvent } from '../lib/amplitude';

const AmplitudeContext = createContext();

function AmplitudeProvider({ children }) {
    const { amplitudeApiKey: apiKey, amplitudeEndPoint: apiEndpoint } = useConfig();

    useEffect(() => {
        if (apiKey && apiEndpoint) {
            initAmplitude({ apiKey, apiEndpoint });
        }
    }, [apiKey, apiEndpoint]);

    return <AmplitudeContext.Provider value={{ logAmplitudeEvent }}>{children}</AmplitudeContext.Provider>;
}

function useAmplitude() {
    const context = useContext(AmplitudeContext);
    if (context === undefined) {
        throw new Error('useAmplitude må brukes under en AmplitudeProvider');
    }
    return context;
}

export { AmplitudeProvider, useAmplitude };
