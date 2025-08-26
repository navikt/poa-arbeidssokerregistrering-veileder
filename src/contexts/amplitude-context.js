import { createContext, useEffect } from 'react';

import { useConfig } from './config-context';

import { initAmplitude } from '../lib/amplitude';

const AmplitudeContext = createContext();

function AmplitudeProvider({ children }) {
    const { amplitudeApiKey: apiKey, amplitudeEndPoint: apiEndpoint } = useConfig();

    useEffect(() => {
        if (apiKey && apiEndpoint) {
            initAmplitude({ apiKey, apiEndpoint });
        }
    }, [apiKey, apiEndpoint]);

    return <AmplitudeContext.Provider>{children}</AmplitudeContext.Provider>;
}

export { AmplitudeProvider };
