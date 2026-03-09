/**
 * Types for the `kanStartePeriode` API (PUT /api/v2/arbeidssoker/kanStartePeriode).
 *
 * Based on the OpenAPI spec:
 * https://github.com/navikt/paw-arbeidssoekerregisteret-monorepo-intern/blob/main/apps/api-start-stopp-perioder/src/main/resources/openapi/startstopp.yaml
 */

// --- Enums ---

export type FeilKode =
    | 'UKJENT_FEIL'
    | 'UVENTET_FEIL_MOT_EKSTERN_TJENESTE'
    | 'FEIL_VED_LESING_AV_FORESPORSEL'
    | 'AVVIST'
    | 'IKKE_TILGANG';

export type ApiRegelId =
    | 'UKJENT_REGEL'
    | 'IKKE_FUNNET'
    | 'SAVNET'
    | 'DOED'
    | 'OPPHOERT_IDENTITET'
    | 'ENDRE_FOR_ANNEN_BRUKER'
    | 'ANSATT_IKKE_TILGANG_TIL_BRUKER'
    | 'IKKE_TILGANG'
    | 'UNDER_18_AAR'
    | 'IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN'
    | 'ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT'
    | 'UKJENT_ALDER';

export type Opplysning =
    | 'FORHAANDSGODKJENT_AV_ANSATT'
    | 'SAMME_SOM_INNLOGGET_BRUKER'
    | 'IKKE_SAMME_SOM_INNLOGGER_BRUKER'
    | 'ANSATT_IKKE_TILGANG'
    | 'ANSATT_TILGANG'
    | 'IKKE_ANSATT'
    | 'SYSTEM_IKKE_TILGANG'
    | 'SYSTEM_TILGANG'
    | 'IKKE_SYSTEM'
    | 'ER_OVER_18_AAR'
    | 'ER_UNDER_18_AAR'
    | 'UKJENT_FOEDSELSDATO'
    | 'UKJENT_FOEDSELSAAR'
    | 'TOKENX_PID_IKKE_FUNNET'
    | 'OPPHOERT_IDENTITET'
    | 'IKKE_BOSATT'
    | 'DOED'
    | 'SAVNET'
    | 'HAR_NORSK_ADRESSE'
    | 'HAR_UTENLANDSK_ADRESSE'
    | 'INGEN_ADRESSE_FUNNET'
    | 'BOSATT_ETTER_FREG_LOVEN'
    | 'DNUMMER'
    | 'UKJENT_FORENKLET_FREG_STATUS'
    | 'HAR_GYLDIG_OPPHOLDSTILLATELSE'
    | 'OPPHOLDSTILATELSE_UTGAATT'
    | 'BARN_FOEDT_I_NORGE_UTEN_OPPHOLDSTILLATELSE'
    | 'INGEN_INFORMASJON_OM_OPPHOLDSTILLATELSE'
    | 'UKJENT_STATUS_FOR_OPPHOLDSTILLATELSE'
    | 'PERSON_IKKE_FUNNET'
    | 'SISTE_FLYTTING_VAR_UT_AV_NORGE'
    | 'SISTE_FLYTTING_VAR_INN_TIL_NORGE'
    | 'IKKE_MULIG_AA_IDENTIFISERE_SISTE_FLYTTING'
    | 'INGEN_FLYTTE_INFORMASJON'
    | 'ER_GBR_STATSBORGER'
    | 'ER_EU_EOES_STATSBORGER'
    | 'ER_NORSK_STATSBORGER'
    | 'HAR_REGISTRERT_ADRESSE_I_EU_EOES'
    | 'UKJENT_OPPLYSNING'
    | 'ER_FEILRETTING'
    | 'UGYLDIG_FEILRETTING';

// --- Composite types ---

export type ApiRegel = {
    id: ApiRegelId;
    beskrivelse: string;
};

export type AarsakTilAvvisning = {
    regler: ApiRegel[];
    detaljer: Opplysning[];
};

/**
 * Error response from the `kanStartePeriode` API (FeilV2 in the OpenAPI spec).
 *
 * When `feilKode` is `'AVVIST'`, `aarsakTilAvvisning` contains the rules that
 * caused the rejection along with supporting details/opplysninger.
 */
export type KanStartePeriodeFeil = {
    melding: string;
    feilKode: FeilKode;
    aarsakTilAvvisning?: AarsakTilAvvisning;
};

// --- Result type for the server action ---

export type KanStartePeriodeResult = { ok: true } | { ok: false; error: string; feil?: KanStartePeriodeFeil };
