import {
    DinSituasjon,
    JaEllerNei,
    SisteStillingValg,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';
import type { RegistreringState } from '@/model/registrering';

/**
 * Felter som alltid må være utfylt (uavhengig av stilling).
 */
const PAKREVDE_SVAR_UNNTATT_STILLING: SporsmalId[] = [
    SporsmalId.andreForhold,
    SporsmalId.dinSituasjon,
    SporsmalId.helseHinder,
    SporsmalId.utdanningBestatt,
    SporsmalId.utdanningGodkjent,
    SporsmalId.utdanning,
];

/**
 * Minst ett av disse feltene må finnes i registreringen for at stilling-kravet er oppfylt.
 */
const MULIGE_STILLINGS_SVAR: SporsmalId[] = [SporsmalId.sisteJobb, SporsmalId.sisteStilling];

/**
 * Jobbsituasjoner som krever at bruker har tatt stilling til «siste jobb»-spørsmålet.
 */
const SITUASJONER_SOM_KREVER_SISTE_JOBB: DinSituasjon[] = [
    DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
    DinSituasjon.JOBB_OVER_2_AAR,
    DinSituasjon.USIKKER_JOBBSITUASJON,
];

/**
 * Utdanningsnivåer som ikke krever at «bestått» og «godkjent» er besvart.
 */
const UTDANNINGSNIVAAER_UTEN_KRAV_OM_GODKJENT_OG_BESTATT: Utdanningsnivaa[] = [
    Utdanningsnivaa.INGEN_UTDANNING,
    Utdanningsnivaa.INGEN_SVAR,
    Utdanningsnivaa.GRUNNSKOLE,
];

/**
 * Sjekker om alle påkrevde felter (utenom stilling) er til stede i registreringen.
 */
function harAllePakrevdeSvarUnntattStilling(registrering: RegistreringState): boolean {
    const utfyltePakrevdeFelter = Object.keys(registrering)
        .filter((key) => PAKREVDE_SVAR_UNNTATT_STILLING.includes(key as SporsmalId))
        .sort();

    return (
        utfyltePakrevdeFelter.length === PAKREVDE_SVAR_UNNTATT_STILLING.length &&
        utfyltePakrevdeFelter.every((key, i) => key === [...PAKREVDE_SVAR_UNNTATT_STILLING].sort()[i])
    );
}

/**
 * Sjekker om minst ett stilling-relatert felt er til stede.
 */
function harStillingSvar(registrering: RegistreringState): boolean {
    return Object.keys(registrering).some((key) => MULIGE_STILLINGS_SVAR.includes(key as SporsmalId));
}

/**
 * Sjekker om «siste jobb»-valget er gyldig for situasjoner som krever det.
 * Returnerer alltid true dersom situasjonen ikke krever «siste jobb».
 */
function erSisteJobbGyldig(registrering: RegistreringState): boolean {
    const dinSituasjon = registrering.dinSituasjon;
    const kreverSisteJobb = dinSituasjon !== undefined && SITUASJONER_SOM_KREVER_SISTE_JOBB.includes(dinSituasjon);

    if (!kreverSisteJobb) {
        return true;
    }

    const sisteStilling = registrering.sisteStilling;
    return (
        sisteStilling !== undefined &&
        [SisteStillingValg.HAR_HATT_JOBB, SisteStillingValg.HAR_IKKE_HATT_JOBB].includes(sisteStilling)
    );
}

/**
 * Sjekker om utdanningssvarene er gyldige.
 * Dersom utdanningsnivået krever «godkjent» og «bestått», må disse være besvart
 * (dvs. ikke ha verdien INGEN_SVAR for begge samtidig).
 */
function erUtdanningSvarGyldig(registrering: RegistreringState): boolean {
    const utdanningsNivaa = registrering[SporsmalId.utdanning];

    if (utdanningsNivaa === undefined || UTDANNINGSNIVAAER_UTEN_KRAV_OM_GODKJENT_OG_BESTATT.includes(utdanningsNivaa)) {
        return true;
    }

    const godkjentErIkkeSvart = registrering[SporsmalId.utdanningGodkjent] === UtdanningGodkjentValg.INGEN_SVAR;
    const bestattErIkkeSvart = registrering[SporsmalId.utdanningBestatt] === JaEllerNei.INGEN_SVAR;

    return !(godkjentErIkkeSvart && bestattErIkkeSvart);
}

/**
 * Validerer en registrering basert på gjeldende regler.
 *
 * Reglene:
 * 1. Alle påkrevde felter (dinSituasjon, utdanning, utdanningGodkjent, utdanningBestatt, helseHinder, andreForhold) må være utfylt.
 * 2. Minst ett stilling-relatert felt (sisteJobb eller sisteStilling) må være til stede.
 * 3. Dersom dinSituasjon er AKKURAT_FULLFORT_UTDANNING, JOBB_OVER_2_AAR eller USIKKER_JOBBSITUASJON,
 *    må sisteStilling være enten HAR_HATT_JOBB eller HAR_IKKE_HATT_JOBB.
 * 4. Dersom utdanningsnivå krever «godkjent» og «bestått» (dvs. ikke INGEN_UTDANNING, GRUNNSKOLE eller INGEN_SVAR),
 *    kan ikke begge ha verdien INGEN_SVAR samtidig.
 */
function validateRegistrering(registrering: RegistreringState): boolean {
    return (
        harAllePakrevdeSvarUnntattStilling(registrering) &&
        harStillingSvar(registrering) &&
        erSisteJobbGyldig(registrering) &&
        erUtdanningSvarGyldig(registrering)
    );
}

export {
    validateRegistrering,
    harAllePakrevdeSvarUnntattStilling,
    harStillingSvar,
    erSisteJobbGyldig,
    erUtdanningSvarGyldig,
};
