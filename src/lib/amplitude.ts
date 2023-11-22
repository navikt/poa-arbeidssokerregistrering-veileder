import amplitude from 'amplitude-js';

import { ErrorTypes } from '../model/error';
import { RegistreringType } from '../model/registrering';

const isBrowser = () => typeof window !== 'undefined';

const config = {
    saveEvents: false,
    includeUtm: true,
    includeReferrer: true,
    trackingOptions: {
        city: false,
        ip_address: false,
    },
};

type EventData = SidevisningData | AktivitetData | FlytData;

type SidevisningData = { sidetittel: string };

type AktivitetData =
    | { aktivitet: KvitteringAktivitet }
    | { aktivitet: 'Går til servicerutine for friskmelding til arbeidsformidling'; registreringtype?: RegistreringType }
    | { aktivitet: 'Går til servicerutine for arbeids- og oppholdstillatelse'; registreringtype?: RegistreringType }
    | { aktivitet: 'Endrer foreslått stilling' }
    | { aktivitet: 'Leser hva er nytt' }
    | { aktivitet: 'Går til skjema for dagpenger' };

type FlytData =
    | {
          hendelse: 'Ikke mulig å registrere personen';
          aarsak?: RegistreringType;
      }
    | { hendelse: 'Start av registrering feiler' }
    | { hendelse: 'Starter registrering av arbeidssøker' }
    | { hendelse: 'Starter registrering for mer sykmeldtoppfølging' }
    | { hendelse: 'Starter reaktivering av arbeidssøker' }
    | { hendelse: 'Sender inn skjema for registrering av arbeidssøker' }
    | { hendelse: 'Sender inn skjema for reaktivering av arbeidssøker' }
    | { hendelse: 'Sender inn skjema for mer sykmeldtoppfølging' }
    | { hendelse: 'Får ikke fullført registreringen av arbeidssøker'; aarsak?: ErrorTypes }
    | { hendelse: 'Får ikke fullført registrering for mer sykmeldtoppfølging'; aarsak?: ErrorTypes }
    | { hendelse: 'Får ikke fullført reaktivering av arbeidssøker'; aarsak?: ErrorTypes }
    | { hendelse: 'Registrering for mer sykmeldtoppfølging fullført' }
    | { hendelse: 'Reaktivering av arbeidssøker fullført' }
    | { hendelse: 'Registrering av arbeidssøker fullført' };

type KvitteringAktivitet =
    | 'Viser kvittering for registrert arbeidssøker'
    | 'Viser kvittering for reaktivert arbeidssøker'
    | 'Viser kvittering for mer sykmeldtoppfølging';

type AmplitudeParams = { apiKey: string; apiEndpoint: string };
type AmplitudeInitFunction = (params: AmplitudeParams) => void;

export const initAmplitude: AmplitudeInitFunction = ({ apiKey, apiEndpoint }) => {
    if (isBrowser()) {
        amplitude.getInstance().init(apiKey, undefined, { ...config, apiEndpoint });
    }
};

export function logAmplitudeEvent(eventName: string, data: EventData) {
    return new Promise(function (resolve) {
        const eventData = data || {};
        if (isBrowser()) {
            amplitude.getInstance().logEvent(eventName, { ...eventData }, resolve);
        }
    });
}

export function loggAktivitet(data: AktivitetData) {
    const eventData = data || ({} as EventData);
    logAmplitudeEvent('arbeidssokerregistrering-veileder.aktiviteter', eventData);
}

export function loggFlyt(data: FlytData) {
    const eventData = data || ({} as EventData);
    logAmplitudeEvent('arbeidssokerregistrering-veileder.flyt', eventData);
}
