import { Profilering, OpplysningerOmArbeidssoker, UtfoertAv, Bekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { BekreftelseStatus } from './bekreftelse';

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

export interface Hendelse {
    hendelseType: string;
    tidspunkt: string;
    [index: string]: PeriodeStart | PeriodeStopp | OpplysningerOmArbeidssoker | Profilering | BekreftelseHendelse | any;
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
