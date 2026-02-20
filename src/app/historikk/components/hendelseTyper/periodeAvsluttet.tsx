import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { PeriodeAvsluttetHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Box } from '@navikt/ds-react';
import type React from 'react';
import { TEKSTER } from '@/components/tidslinjer/text';
import { oversettSluttaarsak } from '@/lib/oversett-sluttaarsak';

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
