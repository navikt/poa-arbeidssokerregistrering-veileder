import React from 'react';
import { BekreftelseV1Hendelse } from '../models/tidslinjer.types';
import { Box, List, ReadMore, Tag } from '@navikt/ds-react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';
import { prettyPrintDato } from '../../../lib/date-utils';

type BekreftelseProps = {
    bekreftelse: BekreftelseV1Hendelse;
};

const Bekreftelse: React.FC<BekreftelseProps> = (props) => {
    const { bekreftelse } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const erGyldig = bekreftelse.bekreftelseV1.status === 'GYLDIG';

    return (
        <div>
            <Box as={'p'}>
                <b>Status</b>
                {': '}
                {tekst(bekreftelse.bekreftelseV1.status)}
                <Tag variant={erGyldig ? 'success' : 'warning'} className="ml-2">
                    {erGyldig ? 'Gyldig' : 'Ikke gyldig'}
                </Tag>
            </Box>
            <Box as={'p'}>
                {/* Dato sendt inn (fra/til på bekreftelsen) */}
                <ReadMore header="Bekreftede opplysninger">
                    <List size="small">
                        <List.Item>
                            <strong>Bekreftelse for følgende periode</strong>
                            <br />
                            {prettyPrintDato(bekreftelse.bekreftelseV1.bekreftelse.svar.gjelderFra)}
                            {' - '}
                            {prettyPrintDato(bekreftelse.bekreftelseV1.bekreftelse.svar.gjelderTil)}
                        </List.Item>
                        <List.Item>
                            <strong>Jobbet i perioden</strong>
                            <br />
                            {bekreftelse.bekreftelseV1.bekreftelse.svar.harJobbetIDennePerioden ? 'Ja' : 'Nei'}
                        </List.Item>
                        <List.Item>
                            <strong>Vil du fotsatt være arbeidssøker?</strong>
                            <br />
                            {bekreftelse.bekreftelseV1.bekreftelse.svar.vilFortsetteSomArbeidssoeker ? 'Ja' : 'Nei'}
                        </List.Item>
                    </List>
                </ReadMore>
            </Box>
        </div>
    );
};

export { Bekreftelse };
