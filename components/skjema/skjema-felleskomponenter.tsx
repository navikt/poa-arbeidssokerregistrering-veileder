export interface SkjemaKomponentProps<T> {
    onChange: (value: T) => void;
    valgt?: T;
    visFeilmelding?: boolean;
}
