import { AggregerteBekreftelser, BekreftelseMedStatus, BekreftelseStatus } from '../model/bekreftelse';
import {
    AggregertPeriode,
    AggregertePerioder,
    AggregertePerioderMedBekreftelseStatus,
} from '../types/aggregerte-perioder';

function isGyldigBekreftelse(bekreftelse: BekreftelseMedStatus | undefined) {
    return bekreftelse && bekreftelse.status === BekreftelseStatus.GYLDIG;
}

export function mergeGyldigeBekreftelser(
    aggregertePerioder: AggregertePerioder,
    aggregerteBekreftelser: AggregerteBekreftelser,
) {
    return aggregertePerioder.map((periode: AggregertPeriode) => {
        periode.bekreftelser = aggregerteBekreftelser[periode.periodeId]
            ? aggregerteBekreftelser[periode.periodeId].filter(isGyldigBekreftelse)
            : [];
        return periode;
    });
}
