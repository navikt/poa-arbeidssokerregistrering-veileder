import { Bekreftelse } from '@navikt/arbeidssokerregisteret-utils';

export interface AggregerteBekreftelser {
    [index: string]: Bekreftelse[];
}
