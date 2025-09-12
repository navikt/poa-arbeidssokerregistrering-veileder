import React from 'react';
import { OpplysningerV4Hendelse } from '../models/tidslinjer.types';
import { List, ReadMore } from '@navikt/ds-react';
import { mapOpplysninger } from '../../opplysninger-om-arbeidssoker-komponent';
import { lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';

type OpplysningerProps = {
    opplysninger: OpplysningerV4Hendelse;
};

const Opplysninger: React.FC<OpplysningerProps> = (props) => {
    const { opplysninger } = props;
    // Tror det er en feil på "velg den situasjonen som passer deg best"
    // TODO: Tror vi kan legge til nåværende stilling (ikke reelt brukt, men vi har jo dataen 🤷‍♀️)
    // Mulig vi bare må lage vår egen mapOpplysninger - Er ikke så stor.
    const opplysningerFormatted = mapOpplysninger(opplysninger.opplysningerV4 as any);
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');

    return (
        <ReadMore header="Innsendte opplysninger">
            <List size="small">
                {opplysningerFormatted.map((field, i) => (
                    <List.Item key={i}>
                        <strong>{tekst(field.sporsmal)}</strong>
                        <br />
                        {tekst(field.svar as string) ?? field.svar}
                    </List.Item>
                ))}
            </List>
        </ReadMore>
    );
};

export { Opplysninger };
