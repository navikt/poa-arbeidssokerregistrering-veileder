import { type Faro, initializeFaro } from '@grafana/faro-web-sdk';

const isBrowser = () => typeof window !== 'undefined';
const isProduction = isBrowser() && window.location.href.includes('intern.nav.no');
const isDevelopment = isBrowser() && /intern|ansatt\.dev\.nav\.no/.test(window.location.href);
const isDemo = isBrowser() && window.location.href.includes('ekstern.dev.nav.no');
const isLocal = isBrowser() && window.location.href.includes('localhost');

const getEnvironment = () => {
    if (isProduction) {
        return 'production';
    }

    if (isDevelopment) {
        return 'development';
    }

    if (isDemo) {
        return 'demo';
    }

    return 'local';
};

const TELEMETRY_URL = {
    local: 'http://localhost:12347/collect',
    development: 'https://telemetry.ekstern.dev.nav.no/collect',
    production: 'https://telemetry.nav.no/collect',
    demo: '',
    // TODO: de url'ene over er fra pages tiden, men pr nå gir de
    // cors-problemer. Tror det er urlene under som er riktig.
    // Vurder å bytt
    // development: 'https://telemetry.intern.dev.nav.no/collect',
    // production: 'https://telemetry.nav.no/collect',
};

export const initFaro = (): Faro | null => {
    if (!isBrowser() || isDemo || isLocal) return null;

    return initializeFaro({
        isolate: true,
        url: TELEMETRY_URL[getEnvironment()],
        app: {
            name: 'arbeidssokerregistrering-for-veileder',
            version: getEnvironment(),
        },
    });
};
