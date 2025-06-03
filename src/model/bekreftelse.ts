import { Bekreftelse } from '@navikt/arbeidssokerregisteret-utils';

export interface BekreftelseMedGyldighet extends Bekreftelse {
    gyldig?: boolean;
}

export interface AggregerteBekreftelser {
    [index: string]: BekreftelseMedGyldighet[];
}
