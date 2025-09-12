import React from 'react';
import { HistorikkInnslagHeader } from '../historikk-innslag-header';
import { BekreftelseV1Hendelse } from '../tidslinjer.types';
import { Box } from '@navikt/ds-react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';

type BekreftelseProps = {
    bekreftelse: BekreftelseV1Hendelse;
};

const Bekreftelse: React.FC<BekreftelseProps> = (props) => {
    const { bekreftelse } = props;
    const utfoortAv = `${bekreftelse.bekreftelseV1.bekreftelse.svar.sendtInnAv.utfoertAv.type} / ${bekreftelse.bekreftelseV1.bekreftelse.bekreftelsesloesning}`;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <div>
            <HistorikkInnslagHeader date={bekreftelse.tidspunkt} title={bekreftelse.hendelseType} source={utfoortAv} />
            <Box as={'p'}>
                <b>Status</b>
                {': '}
                {tekst(bekreftelse.bekreftelseV1.status)}
            </Box>
        </div>
    );
};

export { Bekreftelse };
