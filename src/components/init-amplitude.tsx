import { useConfig } from '../contexts/config-context';
import { useEffect } from 'react';
import { initAmplitude } from '../lib/amplitude';
import { Config } from '../model/config';

export default function InitAmplitude() {
    const { amplitudeApiKey: apiKey, amplitudeEndPoint: apiEndpoint } = useConfig() as Config;

    useEffect(() => {
        if (apiKey && apiEndpoint) {
            initAmplitude({ apiKey, apiEndpoint });
        }
    }, [apiKey, apiEndpoint]);

    return null;
}
