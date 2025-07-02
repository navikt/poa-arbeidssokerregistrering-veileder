import { Box } from '@navikt/ds-react';

import { prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';

import { Hendelse } from '../../model/tidslinjer';

export function HendelseVisning(props: Hendelse) {
    const { hendelseType, tidspunkt } = props;

    return (
        <Box>
            {hendelseType} - {prettyPrintDatoOgKlokkeslett(tidspunkt)}
        </Box>
    );
}
