import {
    ArbeidssokerPeriode,
    OpplysningerOmArbeidssoker,
    Bekreftelse,
    Profilering,
} from '@navikt/arbeidssokerregisteret-utils';

import { BekreftelseMedGyldighet } from '../model/bekreftelse';

export interface OpplysningerMedProfilering extends OpplysningerOmArbeidssoker {
    profilering: Profilering;
}

export interface AggregertPeriode extends ArbeidssokerPeriode {
    opplysningerOmArbeidssoeker: OpplysningerMedProfilering[];
    bekreftelser: Bekreftelse[];
}

export interface AggregertPeriodeMedGyldigBekreftelse {
    opplysningerOmArbeidssoeker: OpplysningerMedProfilering[];
    bekreftelser: BekreftelseMedGyldighet[];
}

export type AggregertePerioder = AggregertPeriode[];

export type AggregertePerioderMedGyldigBekreftelse = AggregertPeriodeMedGyldigBekreftelse[];
