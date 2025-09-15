import React from 'react';
import { Box, List, ReadMore, Tag } from '@navikt/ds-react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';
import { prettyPrintDato } from '../../../lib/date-utils';
import { Hendelse } from '../../../model/schema-api.types';

type BekreftelseProps = {
    bekreftelse: Hendelse['bekreftelse_v1'];
};

const Bekreftelse: React.FC<BekreftelseProps> = (props) => {
    const { bekreftelse } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const erGyldig = bekreftelse.status === 'GYLDIG';

    return (
        <div>
            <Box as={'p'}>
                <b>Status</b>
                {': '}
                {tekst(bekreftelse.status)}
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
                            {prettyPrintDato(bekreftelse.bekreftelse.svar.gjelderFra)}
                            {' - '}
                            {prettyPrintDato(bekreftelse.bekreftelse.svar.gjelderTil)}
                        </List.Item>
                        <List.Item>
                            <strong>Jobbet i perioden</strong>
                            <br />
                            {bekreftelse.bekreftelse.svar.harJobbetIDennePerioden ? 'Ja' : 'Nei'}
                        </List.Item>
                        <List.Item>
                            <strong>Vil du fotsatt være arbeidssøker?</strong>
                            <br />
                            {bekreftelse.bekreftelse.svar.vilFortsetteSomArbeidssoeker ? 'Ja' : 'Nei'}
                        </List.Item>
                    </List>
                </ReadMore>
            </Box>
        </div>
    );
};

export { Bekreftelse };
