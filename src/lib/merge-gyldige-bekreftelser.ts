import { AggregerteBekreftelser, BekreftelseMedGyldighet } from '../model/bekreftelse';
import { AggregertePerioder, AggregertePerioderMedGyldigBekreftelse } from '../types/aggregerte-perioder';

function isGyldigBekreftelse(bekreftelse: BekreftelseMedGyldighet | undefined) {
    return bekreftelse && bekreftelse.gyldig === true;
}

export function mergeGyldigeBekreftelser(
    AggregertePerioder: AggregertePerioder,
    aggregerteBekreftelser: AggregerteBekreftelser,
) {}
