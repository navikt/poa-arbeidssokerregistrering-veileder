import { Bekreftelse } from '@navikt/arbeidssokerregisteret-utils';

export enum BekreftelseStatus {
    'GYLDIG' = 'GYLDIG',
    'UVENTET_KILDE' = 'UVENTET_KILDE',
    'UTENFOR_PERIODE' = 'UTENFOR_PERIODE',
}

export interface BekreftelseMedStatus extends Bekreftelse {
    status?: BekreftelseStatus;
}

export interface AggregerteBekreftelser {
    [index: string]: BekreftelseMedStatus[];
}
