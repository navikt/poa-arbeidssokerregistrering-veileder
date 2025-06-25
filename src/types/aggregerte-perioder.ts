import {
    ArbeidssokerPeriode,
    OpplysningerOmArbeidssoker,
    Bekreftelse,
    Profilering,
} from '@navikt/arbeidssokerregisteret-utils';

import { BekreftelseMedStatus } from '../model/bekreftelse';

export interface OpplysningerMedProfilering extends OpplysningerOmArbeidssoker {
    profilering: Profilering;
}

export interface AggregertPeriode extends ArbeidssokerPeriode {
    opplysningerOmArbeidssoeker: OpplysningerMedProfilering[];
    bekreftelser: Bekreftelse[];
}

export interface AggregertPeriodeMedBekreftelseStatus {
    opplysningerOmArbeidssoeker: OpplysningerMedProfilering[];
    bekreftelser: BekreftelseMedStatus[];
}

export type AggregertePerioder = AggregertPeriode[];

export type AggregertePerioderMedBekreftelseStatus = AggregertePerioderMedBekreftelseStatus[];
