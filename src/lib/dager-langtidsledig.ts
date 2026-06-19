import type { BekreftelseHendelse, Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { daysSinceDate, toMidnight } from './date-utils';

type BekreftelseHendelseMedPeriodeId = BekreftelseHendelse & { periodeId: string };

function diffInDays(a: string | Date, b: string | Date): number {
    const _a = toMidnight(a);
    const _b = toMidnight(b);
    return (_a.getTime() - _b.getTime()) / (1000 * 60 * 60 * 24);
}

function finnAntallDagerLangtidsledig(perioder: Periode[]): number {
    /**
     * Antall dager langtidsledig
     * ===========================
     * Hvor lenge du sammenhengende har sendt inn gyldige bekreftelser
     * - Gyldig bekreftelse === svar "nei" på hvorvidt du har jobbet i perioden
     * - Det kan ikke være mer enn 14* dager mellom 2 bekreftelser
     *
     * - === *UNNTAKET ===
     * Dersom to bekreftelser har et gap på over 14 dager, men de tilhører samme
     * periodeId regnes det som en systemforsinkelse og er likevel godkjent.
     */

    if (perioder.at(0)?.avsluttet) {
        return 0;
    }

    const alleBekreftelser: BekreftelseHendelseMedPeriodeId[] = perioder
        .flatMap((periode) =>
            periode.hendelser
                .filter((h): h is BekreftelseHendelse => h.type === 'BEKREFTELSE_V1')
                .map((h) => ({ ...h, periodeId: periode.periodeId })),
        )
        .sort((a, b) => b.tidspunkt.localeCompare(a.tidspunkt));

    const nyesteBekreftelse = alleBekreftelser.at(0);

    if (!nyesteBekreftelse || nyesteBekreftelse.svar.harJobbetIDennePerioden) {
        return 0;
    }

    let firstValidatedStartDate = toMidnight(new Date());
    let prevPeriodeId = nyesteBekreftelse.periodeId;

    for (const bekreftelse of alleBekreftelser) {
        if (bekreftelse.svar.harJobbetIDennePerioden) {
            break;
        }

        const currentBekreftelseValidUntilDate = bekreftelse.svar.gjelderTil;

        if (diffInDays(firstValidatedStartDate, currentBekreftelseValidUntilDate) > 14) {
            // Avvik på over 14 dager er godkjent dersom bekreftelsene
            // tilhører samme periode (systemforsinkelse)
            if (bekreftelse.periodeId !== prevPeriodeId) {
                break;
            }
        }
        firstValidatedStartDate = toMidnight(bekreftelse.svar.gjelderFra);
        prevPeriodeId = bekreftelse.periodeId;
    }
    return daysSinceDate(firstValidatedStartDate);
}

export { finnAntallDagerLangtidsledig };
