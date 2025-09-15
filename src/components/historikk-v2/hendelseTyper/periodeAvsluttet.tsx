import React from 'react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';
import { Box } from '@navikt/ds-react';
import { oversettSluttaarsak } from '../../../lib/oversett-sluttaarsak';
import { Hendelse } from '../../../model/schema-api.types';

type PeriodeAvsluttetProps = {
    avsluttetHendelse: Hendelse['periode_avsluttet_v1'];
};

const PeriodeAvsluttet: React.FC<PeriodeAvsluttetProps> = (props) => {
    const { avsluttetHendelse } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const sluttaarsak = oversettSluttaarsak('nb');

    return (
        <Box as={'p'}>
            <b>{tekst('sluttarsak')}</b>
            {': '}
            {sluttaarsak(avsluttetHendelse.aarsak)}
        </Box>
    );
};

export { PeriodeAvsluttet };
