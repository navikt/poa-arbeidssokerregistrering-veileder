import {
    DinSituasjon,
    JaEllerNei,
    mapNusKodeTilUtdannignsnivaa,
    SisteStillingValg,
    SporsmalId,
    UtdanningGodkjentValg,
} from '@navikt/arbeidssokerregisteret-utils';
import type { Beskrivelse, OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import type { SisteArbeidsforholdResult } from '@/lib/api/aareg';
import type { RegistreringState } from '@/model/registrering';
import { buildSisteJobb } from './buildSisteJobb';

const BESKRIVELSE_TIL_SITUASJON: Record<Beskrivelse, DinSituasjon> = {
    HAR_SAGT_OPP: DinSituasjon.HAR_SAGT_OPP,
    HAR_BLITT_SAGT_OPP: DinSituasjon.MISTET_JOBBEN,
    ER_PERMITTERT: DinSituasjon.ER_PERMITTERT,
    ALDRI_HATT_JOBB: DinSituasjon.ALDRI_HATT_JOBB,
    IKKE_VAERT_I_JOBB_SISTE_2_AAR: DinSituasjon.JOBB_OVER_2_AAR,
    AKKURAT_FULLFORT_UTDANNING: DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
    VIL_BYTTE_JOBB: DinSituasjon.VIL_BYTTE_JOBB,
    USIKKER_JOBBSITUASJON: DinSituasjon.USIKKER_JOBBSITUASJON,
    MIDLERTIDIG_JOBB: DinSituasjon.ER_PERMITTERT,
    DELTIDSJOBB_VIL_MER: DinSituasjon.DELTIDSJOBB_VIL_MER,
    NY_JOBB: DinSituasjon.ER_PERMITTERT,
    KONKURS: DinSituasjon.ER_PERMITTERT,
    ANNET: DinSituasjon.VIL_FORTSETTE_I_JOBB,
    UDEFINERT: DinSituasjon.INGEN_SVAR,
    UKJENT_VERDI: DinSituasjon.INGEN_SVAR,
};

const SITUASJONER_MED_SISTE_STILLING = [
    DinSituasjon.USIKKER_JOBBSITUASJON,
    DinSituasjon.JOBB_OVER_2_AAR,
    DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
];

export function mapOpplysningerTilInitState(
    opplysning: OpplysningerHendelse | undefined,
    aaregResult?: SisteArbeidsforholdResult,
): RegistreringState {
    if (!opplysning) return {} as RegistreringState;

    const forsteBeskrivelse = opplysning.jobbsituasjon?.beskrivelser?.[0];
    const dinSituasjon = forsteBeskrivelse
        ? (BESKRIVELSE_TIL_SITUASJON[forsteBeskrivelse.beskrivelse] ?? DinSituasjon.INGEN_SVAR)
        : DinSituasjon.INGEN_SVAR;

    const harStilling = Boolean(forsteBeskrivelse?.detaljer?.stilling);
    const sisteStilling = SITUASJONER_MED_SISTE_STILLING.includes(dinSituasjon)
        ? harStilling
            ? SisteStillingValg.HAR_HATT_JOBB
            : SisteStillingValg.HAR_IKKE_HATT_JOBB
        : SisteStillingValg.INGEN_SVAR;

    const sisteJobb = buildSisteJobb(aaregResult, forsteBeskrivelse);

    return {
        [SporsmalId.dinSituasjon]: dinSituasjon,
        [SporsmalId.sisteJobb]: sisteJobb,
        [SporsmalId.sisteStilling]: sisteStilling,
        [SporsmalId.utdanning]: mapNusKodeTilUtdannignsnivaa(opplysning.utdanning?.nus ?? '9'),
        [SporsmalId.utdanningGodkjent]:
            (opplysning.utdanning?.godkjent as UtdanningGodkjentValg) ?? UtdanningGodkjentValg.INGEN_SVAR,
        [SporsmalId.utdanningBestatt]: (opplysning.utdanning?.bestaatt as JaEllerNei) ?? JaEllerNei.INGEN_SVAR,
        [SporsmalId.helseHinder]: (opplysning.helse?.helsetilstandHindrerArbeid as JaEllerNei) ?? JaEllerNei.INGEN_SVAR,
        [SporsmalId.andreForhold]: (opplysning.annet?.andreForholdHindrerArbeid as JaEllerNei) ?? JaEllerNei.INGEN_SVAR,
    };
}
