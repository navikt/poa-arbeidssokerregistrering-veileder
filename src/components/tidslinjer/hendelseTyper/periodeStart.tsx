import React from 'react';
import { PeriodeStartetV1Hendelse } from '../tidslinjer.types';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../text';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../../lib/date-utils';
import { Box } from '@navikt/ds-react';

type PeriodeStartProps = {
    periode: PeriodeStartetV1Hendelse;
};

const PeriodeStart: React.FC<PeriodeStartProps> = (props) => {
    const { periode } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');


    return (
        <div>
            <Box background='surface-info-subtle' padding={'space-16'}>

                {tekst(periode.hendelseType)}
                {': '}
                <span>{prettyPrintDatoOgKlokkeslettKortform(periode.tidspunkt, 'nb', true)}</span>
                {' av'}
                <b> {periode.periodeStartetV1.utfoertAv.type.toLocaleLowerCase()}</b>
            </Box>
        </div>
    );
};

export { PeriodeStart };