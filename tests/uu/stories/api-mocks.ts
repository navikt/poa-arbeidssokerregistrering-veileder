import type { BekreftelseApiResult } from '@/lib/api/bekreftelse';
import type { KartleggingApiEnkeltpersonKompaktResult } from '@/lib/api/kartlegging-enkeltperson';
import type { KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import type { SnapshotResult } from '@/lib/api/oppslag-snapshot';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';

const DAY_MS = 24 * 60 * 60 * 1000;
const officeNames = ['syntetisk-kontor-a', 'syntetisk-kontor-b'];

function makeOfficeRows(unitId: string, count: number): ArbeidssokerKompakt[] {
    return Array.from({ length: count }, (_, index) => {
        const rowNumber = String(index + 1).padStart(3, '0');
        const daysWithoutWork = 5 + ((index * 47) % 260);
        const freeSince = new Date(Date.now() - daysWithoutWork * DAY_MS).toISOString();

        return {
            id: index + 1,
            aktorId: `syntetisk-aktor-${unitId}-${rowNumber}`,
            identitetsnummer: `syntetisk-person-${unitId}-${rowNumber}`,
            fornavn: `syntetisk-${rowNumber}`,
            etternavn: unitId,
            ledighetsperioder: [
                {
                    ledigSiden: freeSince,
                    periodeStartet: freeSince,
                    bekreftelsePaaVegneAv: [index % 2 === 0 ? 'ARBEIDSSOEKERREGISTERET' : 'DAGPENGER'],
                    bekreftelseHarJobbet: index % 2 === 0,
                    bekreftelseVilFortsette: true,
                    egenvurdertTil: index % 3 === 0 ? 'ANTATT_GODE_MULIGHETER' : 'ANTATT_BEHOV_FOR_VEILEDNING',
                },
            ],
            kontortilknytninger: [
                {
                    kontorId: unitId,
                    kontorNavn: unitId,
                    kontorType: 'ARBEIDSOPPFOLGING',
                },
            ],
        };
    });
}

const officeFixtures = new Map(officeNames.map((unitId) => [unitId, makeOfficeRows(unitId, 101)]));

export function getKartlegging(enhetsId: string | null): Promise<KartleggingApiKompaktResult | null> {
    if (!enhetsId) return Promise.resolve(null);
    const arbeidssoekere = officeFixtures.get(enhetsId) ?? makeOfficeRows(enhetsId, 3);
    return delay({ arbeidssoekere, paging: { page: 1, pageSize: 101, hitSize: arbeidssoekere.length, totalCount: arbeidssoekere.length, sortOrder: 'DESC' } });
}

export function getKartleggingForEnkeltperson(
    identitetsnummer: string | null,
): Promise<KartleggingApiEnkeltpersonKompaktResult | null> {
    if (!identitetsnummer) return Promise.resolve(null);
    const matchingRows = makeOfficeRows('syntetisk-person', 1).map((row) => ({
        ...row,
        identitetsnummer,
        fornavn: 'syntetisk',
        etternavn: identitetsnummer.replaceAll('-', ' '),
    }));
    return delay({ arbeidssoekere: matchingRows });
}

function makeSnapshot(identitetsnummer: string): NonNullable<SnapshotResult['snapshot']> {
    const startedAt = identitetsnummer.endsWith('b') ? '2026-03-12T10:00:00.000Z' : '2026-06-18T10:00:00.000Z';
    return {
        id: `syntetisk-periode-${identitetsnummer}`,
        identitetsnummer,
        startet: {
            sendtInnAv: {
                tidspunkt: startedAt,
                utfoertAv: { type: 'VEILEDER', id: 'syntetisk-veileder', sikkerhetsnivaa: 'syntetisk' },
                kilde: 'uu-fixture',
                aarsak: 'Syntetisk testdata',
            },
            tidspunkt: startedAt,
            type: 'PERIODE_STARTET_V1',
        },
    } as NonNullable<SnapshotResult['snapshot']>;
}

export function getSnapshot(identitetsnummer: string | null): Promise<SnapshotResult> {
    if (!identitetsnummer) return Promise.resolve({ snapshot: null });
    if (identitetsnummer === 'syntetisk-person-tom') {
        return delay({ snapshot: null, notFound: true });
    }
    if (identitetsnummer === 'syntetisk-person-feil') {
        return delay({ snapshot: null, error: new Error('Syntetisk datafeil') });
    }
    return delay({ snapshot: makeSnapshot(identitetsnummer) });
}

export function getBekreftelser(identitetsnummer: string | null): Promise<BekreftelseApiResult> {
    return delay({ bekreftelser: identitetsnummer ? [] : null });
}

export async function sendBekreftelse(): Promise<{ ok: false; error: string }> {
    await delay(undefined);
    return { ok: false, error: 'Syntetisk innsending feilet' };
}

export function loggAktivitet(): void {}
export function loggFlyt(): void {}
export function loggVisning(): void {}

function delay<T>(value: T): Promise<T> {
    return new Promise((resolve) => window.setTimeout(() => resolve(value), 120));
}
