import {
    FremtidigSituasjon,
    JaEllerNei,
    SisteStillingValg,
    SporsmalId,
    TilbakeIArbeid,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from './sporsmal';
import { ErrorTypes } from './error';

export enum RegistreringType {
    REAKTIVERING = 'REAKTIVERING',
    SPERRET = 'SPERRET',
    ALLEREDE_REGISTRERT = 'ALLEREDE_REGISTRERT',
    SYKMELDT_REGISTRERING = 'SYKMELDT_REGISTRERING',
    ORDINAER_REGISTRERING = 'ORDINAER_REGISTRERING',
}

export enum Formidlingsgruppe {
    ISERV = 'ISERV',
    ARBS = 'ARBS',
    IARBS = 'IARBS',
    PARBS = 'PARBS',
    RARBS = 'RARBS',
}

export enum Innsatsgruppe {
    STANDARD_INNSATS = 'STANDARD_INNSATS',
    SITUASJONSBESTEMT_INNSATS = 'SITUASJONSBESTEMT_INNSATS',
    BEHOV_FOR_ARBEIDSEVNEVURDERING = 'BEHOV_FOR_ARBEIDSEVNEVURDERING',
}

export enum Servicegruppe {
    BATT = 'BATT',
    BFORM = 'BFORM',
    BKART = 'BKART',
    IKVAL = 'IKVAL',
    IVURD = 'IVURD',
    OPPFI = 'OPPFI',
    VARIG = 'VARIG',
    VURDI = 'VURDI',
    VURDU = 'VURDU',
}

export enum Brukergruppe {
    UKJENT = 'Ukjent',
    STANDARD = 'Standard',
    STANDARD_OG_UNGDOMSINNSATS = 'Standard og ungdomsinnsats',
    STANDARD_OG_OVER_59 = 'Standard og over 59 år',
    SITUASJONSBESTEMT = 'Situasjonsbestemt',
    BEHOV_FOR_ARBEIDSEVNEVURDERING = 'Behov for arbeidsevnevurdering',
    IKKE_VURDERT = 'Ikke vurdert',
}

export type SisteJobb = {
    label: string;
    konseptId: Number;
    styrk08: string;
};

export interface MerSykmeldtoppfolgingState {
    [SporsmalId.fremtidigSituasjon]?: FremtidigSituasjon;
    [SporsmalId.tilbakeIArbeid]?: TilbakeIArbeid;
    [SporsmalId.utdanning]?: Utdanningsnivaa;
    [SporsmalId.utdanningGodkjent]?: UtdanningGodkjentValg;
    [SporsmalId.utdanningBestatt]?: JaEllerNei;
    [SporsmalId.andreForhold]?: JaEllerNei;
    [SporsmalId.sisteStilling]?: SisteStillingValg;
    [SporsmalId.sisteJobb]?: SisteJobb;
    [SporsmalId.helseHinder]?: JaEllerNei;
}

export interface FullforRegistreringResponse {
    type?: ErrorTypes;
}
