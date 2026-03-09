import type { ApiRegelId, KanStartePeriodeFeil } from '@/lib/models/kan-starte-periode';
import { REGLER_SOM_KAN_OVERSTYRES } from '@/model/regler-for-avvisning';

/**
 * Klassifisert resultat fra avvisningen — beskriver _hva_ som skal vises,
 * uten å ta stilling til _hvordan_ det rendres.
 *
 * Beregnes én gang i `RegistreringSjekk` og sendes ned til sub-komponentene
 * slik at alle er garantert å bruke samme beslutningsgrunnlag.
 */
export type AvvisningKlassifisering = {
    /** Regel-ID-ene fra API-et (`aarsakTilAvvisning.regler[].id`). */
    regler: ApiRegelId[];

    /** Ansatt mangler tilgang til bruker (regel eller feilKode). */
    ansattManglerTilgang: boolean;

    /**
     * Alle regler kan overstyres av veileder.
     *
     * `true` betyr at listen kun inneholder regler fra `REGLER_SOM_KAN_OVERSTYRES`.
     * Ukjente regler behandles som ikke-overstyrbare (safe default).
     */
    kanAlleReglerOverstyres: boolean;

    /** UNDER_18_AAR er blant reglene. */
    erUnder18Aar: boolean;

    /** ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT er blant reglene (Arena-instruksjoner). */
    maaRegistreresIArenaFoerst: boolean;
};

/**
 * Klassifiserer en avvisning fra `PUT /api/v2/arbeidssoker/kanStartePeriode`.
 *
 * Ren funksjon uten sideeffekter — trygg å kalle i renderfasen og enkel å
 * enhetsteste.
 */
export function klassifiserAvvisning(feil: KanStartePeriodeFeil): AvvisningKlassifisering {
    const regler: ApiRegelId[] = feil.aarsakTilAvvisning?.regler?.map((r) => r.id) ?? [];

    const ansattManglerTilgang =
        regler.includes('ANSATT_IKKE_TILGANG_TIL_BRUKER') ||
        regler.includes('IKKE_TILGANG') ||
        feil.feilKode === 'IKKE_TILGANG';

    // Alle regler må finnes i den eksplisitte "kan overstyres"-listen.
    // Ukjente / nye regler som ikke er lagt til i listen faller utenfor og
    // gjør at overstyring IKKE tilbys — dette er den trygge standarden.
    const kanAlleReglerOverstyres = regler.length > 0 && regler.every((r) => REGLER_SOM_KAN_OVERSTYRES.includes(r));

    return {
        regler,
        ansattManglerTilgang,
        kanAlleReglerOverstyres,
        erUnder18Aar: regler.includes('UNDER_18_AAR'),
        maaRegistreresIArenaFoerst: regler.includes('ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT'),
    };
}
