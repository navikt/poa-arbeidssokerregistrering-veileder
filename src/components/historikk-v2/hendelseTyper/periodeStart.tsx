import React from 'react';
import { PeriodeStartetV1Hendelse } from '../tidslinjer.types';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../../lib/date-utils';
import { Box } from '@navikt/ds-react';
import { HistorikkInnslagHeader } from '../historikk-innslag-header';

type PeriodeStartProps = {
    periode: PeriodeStartetV1Hendelse;
};

const PeriodeStart: React.FC<PeriodeStartProps> = (props) => {
    const { periode } = props;

    return (
        <div>
            <Box>
                <HistorikkInnslagHeader
                    date={periode.tidspunkt}
                    title={periode.hendelseType}
                    source={periode.periodeStartetV1.utfoertAv.type}
                />
            </Box>
        </div>
    );
};

export { PeriodeStart };
