'use server';

import { ProfilertTil } from '@navikt/arbeidssokerregisteret-utils';
import type {
    BekreftelseHendelse,
    Bekreftelsesloesning,
    EgenvurderingHendelse,
    Hendelse,
    PaaVegneAvStoppHendelse,
} from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { logger } from '@navikt/next-logger';
import { finnAntallDagerLangtidsledig } from '../dager-langtidsledig';
import { getPerioder } from './oppslag-perioder';
import { getSnapshot } from './oppslag-snapshot';

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
