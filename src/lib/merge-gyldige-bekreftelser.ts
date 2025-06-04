import { AggregerteBekreftelser, BekreftelseMedGyldighet } from '../model/bekreftelse';
import {
    AggregertPeriode,
    AggregertePerioder,
    AggregertePerioderMedGyldigBekreftelse,
} from '../types/aggregerte-perioder';

function isGyldigBekreftelse(bekreftelse: BekreftelseMedGyldighet | undefined) {
    return bekreftelse && bekreftelse.gyldig === true;
}

export function mergeGyldigeBekreftelser(
    aggregertePerioder: AggregertePerioder,
    aggregerteBekreftelser: AggregerteBekreftelser,
) {
    return aggregertePerioder.map((periode: AggregertPeriode) => {
        periode.bekreftelser = aggregerteBekreftelser[periode.periodeId].filter(isGyldigBekreftelse);
        return periode;
    });
}
