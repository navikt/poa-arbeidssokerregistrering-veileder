import { Box } from '@navikt/ds-react';

import { prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';

import { Hendelse } from '../../model/tidslinjer';

function snakeToCamel(snakeCaseString) {
    return snakeCaseString.replace(/_([a-z])/g, (match, char) => char.toUpperCase());
}

function hentUtfoertAv(data) {
    const utfoerer = data.bekreftelse
        ? data.bekreftelse.svar.sendtInnAv.utfoertAv
        : data.sendtInnAv
          ? data.sendtInnAv.utfoertAv
          : data.utfoertAv;
    return utfoerer.type;
}

export function HendelseVisning(props: Hendelse) {
    const { hendelseType, tidspunkt } = props;
    const data = props[snakeToCamel(hendelseType)];

    return (
        <Box>
            {hendelseType} - {prettyPrintDatoOgKlokkeslett(tidspunkt, 'nb', true)} - {hentUtfoertAv(data)} -{' '}
            {data.aarsak ? data.aarsak : ''}
        </Box>
    );
}
