import {
    Profilering,
    OpplysningerOmArbeidssoker,
    UtfoertAv,
    Bekreftelse,
    BekreftelseStatus,
    Jobbsituasjon,
} from '@navikt/arbeidssokerregisteret-utils';

export type PeriodeStart = {
    tidspunkt: string;
    utfoertAv: UtfoertAv;
    kilde: string;
    aarsak: string;
};

export type PeriodeStopp = {
    tidspunkt: string;
    utfoertAv: UtfoertAv;
    kilde: string;
    aarsak: string;
};

export type BekreftelseHendelse = {
    status: BekreftelseStatus;
    bekreftelse: Bekreftelse;
};

type Bekreftelsesloesning =
    | 'UKJENT_VERDI'
    | 'ARBEIDSSOEKERREGISTERET'
    | 'DAGPENGER'
    | 'FRISKMELDT_TIL_ARBEIDSFORMIDLING';

export type PaaVegneAvStart = {
    periodeId: string;
    bekreftelsesloesning: Bekreftelsesloesning;
    intervalMS: number;
    graceMS: number;
};

export type PaaVegneAvStopp = {
    periodeId: string;
    bekreftelsesloesning: Bekreftelsesloesning;
    fristBrutt: boolean;
};

export type OpplysningerOmArbeidssokerTidslinjer = Omit<OpplysningerOmArbeidssoker, 'jobbsituasjon'> & {
    jobbsituasjon: {
        beskrivelser: Jobbsituasjon[];
    };
};

export type HendelseType =
    | 'periode_startet_v1'
    | 'periode_avsluttet_v1'
    | 'opplysninger_v4'
    | 'profilering_v1'
    | 'bekreftelse_v1'
    | 'pa_vegne_av_start_v1'
    | 'pa_vegne_av_stopp_v1';

export interface Hendelse {
    hendelseType: HendelseType;
    tidspunkt: string;
    periodeStartetV1?: PeriodeStart;
    periodeAvsluttetV1?: PeriodeStopp;
    opplysningerV4?: OpplysningerOmArbeidssokerTidslinjer;
    profileringV1?: Profilering;
    bekreftelseV1?: BekreftelseHendelse;
    paVegneAvStartV1?: PaaVegneAvStart;
    paVegneAvStoppV1?: PaaVegneAvStopp;
}

export type Tidslinje = {
    periodeId: string;
    identitetsnummer: string;
    startet: string;
    avsluttet: string;
    hendelser: Hendelse[];
};

export interface TidslinjerResponse {
    tidslinjer: Tidslinje[];
}
