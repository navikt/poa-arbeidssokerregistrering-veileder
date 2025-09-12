import React from 'react';
import { PeriodeAvsluttetV1Hendelse } from '../models/tidslinjer.types';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';
import { Box } from '@navikt/ds-react';
import { oversettSluttaarsak } from '../../../lib/oversett-sluttaarsak';

type PeriodeAvsluttetProps = {
    avsluttetHendelse: PeriodeAvsluttetV1Hendelse;
};

const PeriodeAvsluttet: React.FC<PeriodeAvsluttetProps> = (props) => {
    const { avsluttetHendelse } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const sluttaarsak = oversettSluttaarsak('nb');

    return (
        <Box as={'p'}>
            <b>{tekst('sluttarsak')}</b>
            {': '}
            {sluttaarsak(avsluttetHendelse.periodeAvsluttetV1.aarsak)}
        </Box>
    );
};

export { PeriodeAvsluttet };
