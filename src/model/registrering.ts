import {
    type DinSituasjon,
    type JaEllerNei,
    type SisteStillingValg,
    SporsmalId,
    type UtdanningGodkjentValg,
    type Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';

export enum RegistreringType {
    SPERRET = 'SPERRET',
    ALLEREDE_REGISTRERT = 'ALLEREDE_REGISTRERT',
    SYKMELDT_REGISTRERING = 'SYKMELDT_REGISTRERING',
    ORDINAER_REGISTRERING = 'ORDINAER_REGISTRERING',
}

type SisteJobb = {
    label: string;
    konseptId: any;
    styrk08: string;
};

export interface RegistreringState {
    [SporsmalId.dinSituasjon]?: DinSituasjon;
    [SporsmalId.utdanning]?: Utdanningsnivaa;
    [SporsmalId.utdanningGodkjent]?: UtdanningGodkjentValg;
    [SporsmalId.utdanningBestatt]?: JaEllerNei;
    [SporsmalId.andreForhold]?: JaEllerNei;
    [SporsmalId.sisteStilling]?: SisteStillingValg;
    [SporsmalId.sisteJobb]?: SisteJobb;
    [SporsmalId.helseHinder]?: JaEllerNei;
}
