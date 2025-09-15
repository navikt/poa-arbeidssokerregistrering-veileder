import React from 'react';
import { Box, List, ReadMore } from '@navikt/ds-react';
import { prettyPrintDato } from '../../../lib/date-utils';
import { Hendelse } from '../../../model/schema-api.types';

type BekreftelseProps = {
    bekreftelse: Hendelse['bekreftelse_v1'];
};

const Bekreftelse: React.FC<BekreftelseProps> = (props) => {
    const { bekreftelse } = props;

    return (
        <Box as={'p'}>
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
    );
};

export { Bekreftelse };
