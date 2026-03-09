export type ModiaContext = {
    fnr: string | null;
    enhetId: string | null;
};

// --- Opplysninger API (inngang) ---
// Typer basert på OpenAPI spec for POST /api/v1/arbeidssoker/opplysninger

export type JaNeiVetIkke = 'JA' | 'NEI' | 'VET_IKKE';

export type JobbsituasjonBeskrivelse =
    | 'UKJENT_VERDI'
    | 'UDEFINERT'
    | 'HAR_SAGT_OPP'
    | 'HAR_BLITT_SAGT_OPP'
    | 'ER_PERMITTERT'
    | 'ALDRI_HATT_JOBB'
    | 'IKKE_VAERT_I_JOBB_SISTE_2_AAR'
    | 'AKKURAT_FULLFORT_UTDANNING'
    | 'VIL_BYTTE_JOBB'
    | 'USIKKER_JOBBSITUASJON'
    | 'MIDLERTIDIG_JOBB'
    | 'DELTIDSJOBB_VIL_MER'
    | 'NY_JOBB'
    | 'KONKURS'
    | 'ANNET';

export type Detaljer = {
    gjelder_fra_dato_iso8601?: string;
    gjelder_til_dato_iso8601?: string;
    stilling_styrk08?: string;
    stilling?: string;
    prosent?: string;
    siste_dag_med_loenn_iso8601?: string;
    siste_arbeidsdag_iso8601?: string;
};

export type JobbsituasjonMedDetaljer = {
    beskrivelse: JobbsituasjonBeskrivelse;
    detaljer?: Detaljer;
};

export type Jobbsituasjon = {
    beskrivelser: JobbsituasjonMedDetaljer[];
};

export type Utdanning = {
    nus: string;
    bestaatt?: JaNeiVetIkke;
    godkjent?: JaNeiVetIkke;
};

export type Helse = {
    helsetilstandHindrerArbeid: JaNeiVetIkke;
};

export type Annet = {
    andreForholdHindrerArbeid?: JaNeiVetIkke;
};

export type OpplysningerOmArbeidssoeker = {
    utdanning?: Utdanning;
    helse?: Helse;
    jobbsituasjon: Jobbsituasjon;
    annet?: Annet;
};

export type OpplysningerRequest = {
    identitetsnummer: string;
    opplysningerOmArbeidssoeker: OpplysningerOmArbeidssoeker;
};

export type OpplysningerFeilKode =
    | 'UKJENT_FEIL'
    | 'UVENTET_FEIL_MOT_EKSTERN_TJENESTE'
    | 'FEIL_VED_LESING_AV_FORESPORSEL'
    | 'IKKE_TILGANG';

export type OpplysningerFeil = {
    melding: string;
    feilKode: OpplysningerFeilKode;
};
