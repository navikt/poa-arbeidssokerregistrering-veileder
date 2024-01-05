import * as amplitude from '@amplitude/analytics-browser';

import { ErrorTypes } from '../model/error';
import { RegistreringType } from '../model/registrering';
import { Feiltype } from '../model/feilsituasjonTyper';

const isBrowser = () => typeof window !== 'undefined';

const config = {
    saveEvents: false,
    includeUtm: true,
    includeReferrer: true,
    defaultTracking: false,
    trackingOptions: {
        ipAddress: false,
    },
};

type EventData = SidevisningData | AktivitetData | FlytData | VisningsData | StoppsituasjonsData;

type SidevisningData = { sidetittel: string };

type AktivitetData =
    | { aktivitet: KvitteringAktivitet }
    | { aktivitet: 'Går til servicerutine for friskmelding til arbeidsformidling'; registreringtype?: RegistreringType }
    | { aktivitet: 'Går til servicerutine for arbeids- og oppholdstillatelse'; aarsak?: Feiltype }
    | { aktivitet: 'Går til servicerutine for samtykke for personer under 18' }
    | { aktivitet: 'Endrer foreslått stilling' }
    | { aktivitet: 'Leser hva er nytt' }
    | { aktivitet: 'Går til skjema for dagpenger' };

type VisningsData =
    | { viser: 'Kvittering for registrert arbeidssøker' }
    | { viser: 'Kvittering for reaktivert arbeidssøker' }
    | { viser: 'kvittering for mer sykmeldtoppfølging' }
    | { viser: 'mangler tilgang til aa-registeret' }
    | { viser: 'advarsel for registrering av person under 18' }
    | { viser: 'generell feilmelding' };

type StoppsituasjonsData =
    | { aarsakTilStans: 'Personen er allerede registrert i Arena' }
    | { aarsakTilStans: 'Personen mangler oppholdstillatelse i Arena' }
    | { aarsakTilStans: 'Personen står som utvandret i Arena' }
    | { aarsakTilStans: 'Personen står som sperret i Arena' };

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

export const initAmplitude: AmplitudeInitFunction = async ({ apiKey, apiEndpoint }) => {
    if (isBrowser()) {
        await amplitude.init(apiKey, undefined, { ...config, serverUrl: apiEndpoint });
        logAmplitudeEvent('sidevisning', {
            sidetittel: document.title,
        });
    }
};

export function logAmplitudeEvent(eventName: string, data: EventData) {
    const eventData = data || {};
    if (isBrowser()) {
        amplitude.logEvent(eventName, { ...eventData });
    }
}

export function loggAktivitet(data: AktivitetData) {
    const eventData = data || ({} as EventData);
    logAmplitudeEvent('arbeidssokerregistrering-veileder.aktiviteter', eventData);
}

export function loggFlyt(data: FlytData) {
    const eventData = data || ({} as EventData);
    logAmplitudeEvent('arbeidssokerregistrering-veileder.flyt', eventData);
}

export function loggStoppsituasjon(data: StoppsituasjonsData) {
    const eventData = data || ({} as EventData);
    logAmplitudeEvent('arbeidssokerregistrering-veileder.stoppsituasjon', eventData);
}

export function loggVisning(data: VisningsData) {
    const eventData = data || ({} as EventData);
    logAmplitudeEvent('arbeidssokerregistrering-veileder.visning', eventData);
}
