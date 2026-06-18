'use server';

import { ProfilertTil } from '@navikt/arbeidssokerregisteret-utils';
import type {
    BekreftelseHendelse,
    Bekreftelsesloesning,
    EgenvurderingHendelse,
    Hendelse,
    PaaVegneAvStoppHendelse,
    Periode,
} from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { logger } from '@navikt/next-logger';
import { daysSinceDate, toMidnight } from '../date-utils';
import { getPerioder } from './oppslag-perioder';
import { getSnapshot } from './oppslag-snapshot';

function diffInDays(a: string | Date, b: string | Date): number {
    const _a = toMidnight(a);
    const _b = toMidnight(b);
    return (_a.getTime() - _b.getTime()) / (1000 * 60 * 60 * 24);
}

/**
 * FINN TILHØRIGHET
 * @param hendelser
 * @returns gyldige tilhørigheter
 * En "PÅ VEGENE AV" er gyldi dersom det finnes en start-hendelse som ikke har
 * en nyere stopp-hendelse fra samme bekreftelsesloesning.
 * Det er lov å ha flere gyldige tilhørigheter på samme tid.
 */
function finnTilhorighet(hendelser?: Hendelse[]): Bekreftelsesloesning[] {
    const defaultTilhorighet: Bekreftelsesloesning[] = ['ARBEIDSSOEKERREGISTERET'];
    if (!hendelser) return defaultTilhorighet;
    if (!hendelser.some((hendelse) => hendelse.type === 'PAA_VEGNE_AV_START_V1')) return defaultTilhorighet;

    const stoppHendelser: PaaVegneAvStoppHendelse[] = [];
    const gyldigeStartHendelser: Bekreftelsesloesning[] = [];

    for (const hendelse of hendelser) {
        const erStartetHendelse = hendelse.type === 'PAA_VEGNE_AV_START_V1';
        if (erStartetHendelse && gyldigeStartHendelser.some((el) => el === hendelse.bekreftelsesloesning)) {
            continue;
        }
        // 1. vi har en started hendelse
        if (erStartetHendelse) {
            // 2. har den aktuelle start hendelsen en tilhørende stoppet (fra samme løsning) som er nyere?
            const harTilhorendeStoppHendelse = stoppHendelser.find(
                (stoppHendelse) => stoppHendelse.bekreftelsesloesning === hendelse.bekreftelsesloesning,
            );

            // 3. dersom ingen tilhørende stopp-hendelse, så sitter løsningen på et gyldig ansvar
            if (!harTilhorendeStoppHendelse) {
                gyldigeStartHendelser.push(hendelse.bekreftelsesloesning);
            }
        }
        if (hendelse.type === 'PAA_VEGNE_AV_STOPP_V1') stoppHendelser.push(hendelse);
    }
    return gyldigeStartHendelser.length > 0 ? gyldigeStartHendelser : defaultTilhorighet;
}

function formaterEgenvurdering(egenvurdering?: EgenvurderingHendelse) {
    if (!egenvurdering?.egenvurdering) {
        return null;
    }
    return egenvurdering.egenvurdering === ProfilertTil.ANTATT_BEHOV_FOR_VEILEDNING;
}

function finnAntallDagerLangtidsledig(perioder: Periode[]): number {
    /**
     * Antall dager langtidsledig
     * ===========================
     * Hvor lenge du sammenhengende har sendt inn gyldige bekreftelser
     * - Gyldig bekreftelse === svar "nei" på hvorvidt du har jobbet i perioden
     * - Det kan ikke være mer enn 14* dager mellom 2 bekrftelser
     *
     * - === *UNNTAKET ===
     * Dersom siste bekreftelse ikke kommer fra oss (arbeidssøkerregisstet), så kan det være
     * forsinkelser i system, og vi godtar opphold lengre enn 14 dager, gitt at perioden fortsatt
     * er pågående.
     *
     * TODO:
     * Er det mulig at to bekreftelser som ligger lengre bak i historikken, altså ikke siste(nyeste)
     * kan ha mer enn 14 dager i mellom seg og likevel være gyldige. Eller er denne
     * "forsinkelsen" i systemet kun tilstede på den siste bekreftelse?
     * DERSOM så er tilfelle kan vi sjekke en sprik på over 14 opp mot periodeID også.
     */

    // Dersom siste periode er avsluttet er du IKKE i registeret -> 0 dager ledig
    if (perioder.at(0)?.avsluttet) {
        return 0;
    }

    // Sjekk at du i det hele tatt har bekreftelser og at den siste er gyldig, ellers -> 0 dager ledig
    const alleBekreftelser = perioder
        .flatMap((e) => e.hendelser)
        .filter((e) => e.type === 'BEKREFTELSE_V1')
        .sort((a, b) => b.tidspunkt.localeCompare(a.tidspunkt));
    const sisteBekreftelse = alleBekreftelser.at(0);
    if (!sisteBekreftelse || sisteBekreftelse.svar.harJobbetIDennePerioden) {
        return 0;
    }

    let oldetsValidDate = toMidnight(new Date());
    let isFirst = true;

    for (const bekreftelse of alleBekreftelser) {
        if (bekreftelse.svar.harJobbetIDennePerioden) {
            break;
        }

        // Dersom nyeste bekreftelse er en "på vegne av" gjelder andre regler
        const paaVegneAv = bekreftelse.bekreftelsesloesning !== 'ARBEIDSSOEKERREGISTERET';
        if (isFirst && paaVegneAv) {
            oldetsValidDate = toMidnight(bekreftelse.svar.gjelderFra);
        } else {
            const validUntilDate = bekreftelse.svar.gjelderTil;
            if (diffInDays(oldetsValidDate, validUntilDate) >= 14) {
                break;
            }
            oldetsValidDate = toMidnight(bekreftelse.svar.gjelderFra);
        }
        isFirst = false;
    }

    return daysSinceDate(oldetsValidDate);
}

async function getNokkeltall(ident: string | null, enhetsId?: string | null): Promise<NokkeltallResult | null> {
    const parsedEnhetsId = enhetsId ? parseInt(enhetsId, 10) : undefined;
    const erNoe = parsedEnhetsId === 4154;
    if (!ident || !erNoe) {
        logger.warn(`Mangler ident eller enhetsId, ikke mulig å hente nøkkeltall`);
        return null;
    }

    const snapshot = await getSnapshot(ident);
    if (!snapshot || snapshot.snapshot?.avsluttet || snapshot.notFound) {
        return null;
    }

    const perioder = await getPerioder(ident);
    if (!perioder.perioder || perioder.manglerTilgang) {
        return null;
    }

    return {
        dagerUtenArbeid: finnAntallDagerLangtidsledig(perioder.perioder),
        tilhorighet: finnTilhorighet(perioder.perioder?.[0]?.hendelser),
        onskerHjelp: snapshot.snapshot?.egenvurdering
            ? {
                  svar: formaterEgenvurdering(snapshot.snapshot?.egenvurdering),
                  dato: snapshot.snapshot?.egenvurdering?.tidspunkt,
              }
            : null,
        bekreftelse: perioder.perioder?.[0]?.hendelser.find((e) => e.type === 'BEKREFTELSE_V1'),
    };
}

export type NokkeltallResult = {
    dagerUtenArbeid: number | null;
    tilhorighet: Bekreftelsesloesning[];
    onskerHjelp: {
        svar: boolean | null;
        dato: string | undefined;
    } | null;
    bekreftelse: BekreftelseHendelse | undefined;
};

export { getNokkeltall };
