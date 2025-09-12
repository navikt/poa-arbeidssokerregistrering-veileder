import React from 'react';
import { PeriodeAvsluttetV1Hendelse } from '../tidslinjer.types';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../../lib/date-utils';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';
import { Box, Tooltip } from '@navikt/ds-react';
import { DatabaseIcon } from '@navikt/aksel-icons';
import { oversettSluttaarsak } from '../../../lib/oversett-sluttaarsak';
import { HistorikkInnslagHeader } from '../historikk-innslag-header';

type PeriodeAvsluttetProps = {
    avsluttetHendelse: PeriodeAvsluttetV1Hendelse;
};

const PeriodeAvsluttet: React.FC<PeriodeAvsluttetProps> = (props) => {
    const { avsluttetHendelse } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const sluttaarsak = oversettSluttaarsak('nb');

    return (
        <div>
            <HistorikkInnslagHeader
                date={avsluttetHendelse.tidspunkt}
                title={avsluttetHendelse.hendelseType}
                source={avsluttetHendelse.periodeAvsluttetV1.utfoertAv.type}
            />
            <Box as={'p'}>
                <b>{tekst('sluttarsak')}</b>
                {': '}
                {sluttaarsak(avsluttetHendelse.periodeAvsluttetV1.aarsak)}
            </Box>
        </div>
    );
};

export { PeriodeAvsluttet };
