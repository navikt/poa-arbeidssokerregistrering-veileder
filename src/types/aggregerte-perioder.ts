import {
    ArbeidssokerPeriode,
    OpplysningerOmArbeidssoker,
    Bekreftelse,
    Profilering,
} from '@navikt/arbeidssokerregisteret-utils';

interface OpplysningerMedProfilering extends OpplysningerOmArbeidssoker {
    profilering: Profilering;
}

export interface AggregertPeriode extends ArbeidssokerPeriode {
    opplysningerOmArbeidssoeker: OpplysningerMedProfilering[];
    bekreftelser: Bekreftelse[];
}

export type AggregertePerioder = AggregertPeriode[];
