import {
    DinSituasjon,
    FremtidigSituasjon,
    JaEllerNei,
    SisteStillingValg,
    SisteJobb,
    SporsmalId,
    TilbakeIArbeid,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';

export interface SkjemaState {
    [SporsmalId.dinSituasjon]?: DinSituasjon;
    [SporsmalId.utdanning]?: Utdanningsnivaa;
    [SporsmalId.utdanningGodkjent]?: UtdanningGodkjentValg;
    [SporsmalId.utdanningBestatt]?: JaEllerNei;
    [SporsmalId.andreForhold]?: JaEllerNei;
    [SporsmalId.sisteStilling]?: SisteStillingValg;
    [SporsmalId.sisteJobb]?: SisteJobb;
    [SporsmalId.helseHinder]?: JaEllerNei;
    [SporsmalId.fremtidigSituasjon]?: FremtidigSituasjon;
    [SporsmalId.tilbakeIArbeid]?: TilbakeIArbeid;
    startTid?: number;
}

export function visSisteStilling(skjemaState: SkjemaState) {
    return skjemaState.dinSituasjon
        ? [
              DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
              DinSituasjon.JOBB_OVER_2_AAR,
              DinSituasjon.USIKKER_JOBBSITUASJON,
          ].includes(skjemaState.dinSituasjon)
        : false;
}

export type Side = 'standard' | 'sykmeldt';
