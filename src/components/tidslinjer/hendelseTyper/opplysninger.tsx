import React from 'react';
import { OpplysningerV4Hendelse } from '../tidslinjer.types';
import { Box, List } from '@navikt/ds-react';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../../lib/date-utils';
import { mapOpplysninger, OpplysningerKomponent } from '../../opplysninger-om-arbeidssoker-komponent';
import { lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';

type OpplysningerProps = {
    opplysninger: OpplysningerV4Hendelse;
};

const Opplysninger: React.FC<OpplysningerProps> = (props) => {
    const { opplysninger } = props;

    // Tror det er en feil på "velg den situasjonen som passer deg best"
    // TODO: Tror vi kan legge til nåværende stilling (ikke reelt brukt, men vi har jo dataen 🤷‍♀️)
    // Mulig vi bare må lage vår egen mapOpplysninger - Er ikke så stor.
    const tee = mapOpplysninger(opplysninger.opplysningerV4 || []);
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');

    return (
        <div>
            <p>
                <Box background='surface-info-subtle' padding={'space-16'}>

                    Opplysninger er sendt inn
                    {' '}
                    {prettyPrintDatoOgKlokkeslettKortform(opplysninger.tidspunkt, 'nb', true)}
                    {' '}
                    av
                    {' '}
                    <b>{opplysninger.opplysningerV4.sendtInnAv.utfoertAv.type.toLocaleLowerCase()}</b>
                </Box>
            </p>
            {JSON.stringify(tekst)}
            {/* <OpplysningerKomponent opplysninger={opplysninger} /> */}

            <List>
                {tee.map((field, i) => (
                    <List.Item key={i}>
                        <strong>{tekst(field.sporsmal)}</strong>
                        <br />
                        {tekst(field.svar as string) ?? field.svar}
                    </List.Item>
                ))}
                {/* <List.Item>Opplysninger ID: {opplysninger.opplysningerV4.id}</List.Item>
                <List.Item>Opplysninger tidspunkt: {opplysninger.tidspunkt}</List.Item> */}
            </List>
        </div>
    );
};

export { Opplysninger };