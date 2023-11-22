import { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { fetcher } from '../lib/api-utils';

const FeatureToggleContext = createContext();

function FeatureToggleProvider({ children }) {
    const [toggles, setToggles] = useState({});
    const { data } = useSWR('/api/features/', fetcher);

    useEffect(() => {
        if (data) {
            const aktiveFeatures = data.reduce((features, feature) => {
                if (feature.enabled) {
                    features[feature.name] = true;
                }
                return features;
            }, {});
            setToggles(aktiveFeatures);
        }
    }, [data]);

    return <FeatureToggleContext.Provider value={{ toggles }}>{children}</FeatureToggleContext.Provider>;
}

function useFeatureToggles() {
    const context = useContext(FeatureToggleContext);
    if (context === undefined) {
        throw new Error('useFeatureToggles må brukes under en FeatureToggleProvider');
    }
    return context;
}

export { FeatureToggleProvider, useFeatureToggles };
