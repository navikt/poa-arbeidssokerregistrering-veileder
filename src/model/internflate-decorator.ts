interface ControlledContextvalue<T> extends BaseContextvalue<T> {
    value: string | null;
}
interface UncontrolledContextvalue<T> extends BaseContextvalue<T> {
    initialValue: string | null;
}

interface BaseContextvalue<T> {
    skipModal?: boolean;
    ignoreWsEvents?: boolean;
    display: T;
    onChange(value: string | null): void;
}

type Contextvalue<T> = ControlledContextvalue<T> | UncontrolledContextvalue<T>;
type EnhetContextvalue = Contextvalue<string>;
type FnrContextvalue = Contextvalue<string>;
interface TogglesConfig {
    visVeileder?: boolean; // Styrer om man skal vise informasjon om innlogget veileder
}
export interface DecoratorConfig {
    appname: string; // Navn på applikasjon
    fnr?: FnrContextvalue; // Konfigurasjon av fødselsnummer-kontekst
    enhet?: EnhetContextvalue; // Konfigurasjon av enhet-kontekst
    toggles?: TogglesConfig; // Konfigurasjon av hvilke elementer som skal vises i dekoratøren
    useProxy?: boolean; // Manuell overstyring av urlene til BFFs. Gjør alle kall til relativt path, og trenger derfor proxy oppsett. Default: false
}
