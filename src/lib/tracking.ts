import { ErrorTypes } from '../model/error';
import { RegistreringType } from '../model/registrering';
import { Feiltype } from '../model/feilsituasjonTyper';

const isBrowser = () => typeof window !== 'undefined';
const isDevelopment = () => isBrowser() && /^http:\/\/localhost/.test(window.location.href);

type EventData = SidevisningData | AktivitetData | FlytData | VisningsData | StoppsituasjonsData;

type SidevisningData = { sidetittel: string };

type AktivitetData =
    | { aktivitet: KvitteringAktivitet }
    | { aktivitet: 'Går til servicerutine for friskmelding til arbeidsformidling'; registreringtype?: RegistreringType }
    | { aktivitet: 'Går til servicerutine for arbeids- og oppholdstillatelse'; aarsak?: Feiltype }
    | { aktivitet: 'Går til servicerutine for samtykke for personer under 18' }
    | { aktivitet: 'Endrer foreslått stilling' }
    | { aktivitet: 'Leser hva er nytt' }
    | { aktivitet: 'Går til skjema for dagpenger' }
    | { aktivitet: 'Klikker på "Fyll inn opplysninger fra siste arbeidssøkerperiode"' }
    | { aktivitet: 'Går til historikk' }
    | { aktivitet: 'Går til tidslinjer' }
    | { aktivitet: 'Går til bekreftelser' }
    | { aktivitet: 'Sender inn bekreftelse på vegne av bruker' }
    | { aktivitet: 'Går til avslutt arbeidssøkerperiode' }
    | { aktivitet: 'Går til slett arbeidssøkerperiode' }
    | { aktivitet: 'Går til endre opplysninger' }
    | { aktivitet: 'Avslutter arbeidssøkerperiode' }
    | { aktivitet: 'Sletter arbeidssøkerperiode' }
    | { aktivitet: 'Klikker på "Se alle arbeidssøkerperioder bruker har hatt"' };

type VisningsData =
    | { viser: 'Kvittering for registrert arbeidssøker' }
    | { viser: 'Kvittering for reaktivert arbeidssøker' }
    | { viser: 'kvittering for mer sykmeldtoppfølging' }
    | { viser: 'mangler tilgang til aa-registeret' }
    | { viser: 'advarsel for registrering av person under 18' }
    | { viser: 'siden for å avslutte en arbeidssøkerperiode' }
    | { viser: 'siden for å slette en arbeidssøkerperiode' }
    | { viser: 'kvittering for avsluttet arbeidssøkerperiode' }
    | { viser: 'kvittering for slettet arbeidssøkerperiode' }
    | { viser: 'generell feilmelding' }
    | { viser: 'Kvittering for oppdatert opplysninger' };

type StoppsituasjonsData =
    | { aarsakTilStans: 'Personen er allerede registrert i Arena' }
    | { aarsakTilStans: 'Personen mangler oppholdstillatelse i Arena' }
    | { aarsakTilStans: 'Personen står som utvandret i Arena' }
    | { aarsakTilStans: 'Personen står som sperret i Arena' }
    | { aarsakTilStans: 'Personen får kan ikke reaktiveres fra Arena' };

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
    | { hendelse: 'Kan ikke registreres for mer sykmeldtoppfølging' }
    | { hendelse: 'Registrering av arbeidssøker fullført' }
    | { hendelse: 'Får ikke oppdatert opplysninger' }
    | { hendelse: 'Opplysninger oppdatert' };

type KvitteringAktivitet =
    | 'Viser kvittering for registrert arbeidssøker'
    | 'Viser kvittering for reaktivert arbeidssøker'
    | 'Viser kvittering for mer sykmeldtoppfølging';

function logUmamiEvent(eventName: string, data: EventData) {
    try {
        if (isBrowser() && !isDevelopment()) {
            // @ts-ignore
            if (!window.umami) {
                console.debug('umami ikke lastet');
                return;
            }
            // @ts-ignore
            window.umami.track(eventName, data);
        } else {
            console.log(`Logger til umami: ${eventName}`, data);
        }
    } catch (error) {
        console.warn('Feil med umami', error);
    }
}

export function loggAktivitet(data: AktivitetData) {
    const eventData = data || ({} as EventData);
    logUmamiEvent('arbeidssokerregistrering-veileder.aktiviteter', eventData);
}

export function loggFlyt(data: FlytData) {
    const eventData = data || ({} as EventData);
    logUmamiEvent('arbeidssokerregistrering-veileder.flyt', eventData);
}

export function loggVisning(data: VisningsData) {
    const eventData = data || ({} as EventData);
    logUmamiEvent('arbeidssokerregistrering-veileder.visning', eventData);
}
