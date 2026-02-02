import React from 'react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';
import { Box } from '@navikt/ds-react';
import { oversettSluttaarsak } from '../../../lib/oversett-sluttaarsak';
import { PeriodeAvsluttetHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type PeriodeAvsluttetProps = {
    avsluttetHendelse: PeriodeAvsluttetHendelse;
};

const PeriodeAvsluttet: React.FC<PeriodeAvsluttetProps> = (props) => {
    const { avsluttetHendelse } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const sluttaarsak = oversettSluttaarsak('nb');

    return (
        <Box as={'p'}>
            <b>{tekst('sluttarsak')}</b>
            {': '}
            {sluttaarsak(avsluttetHendelse.sendtInnAv.aarsak)}
        </Box>
    );
};

export { PeriodeAvsluttet };
