import React from 'react';
import { List, ReadMore } from '@navikt/ds-react';
import { mapOpplysninger } from '../../opplysninger-om-arbeidssoker-komponent';
import { lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';
import { Hendelse } from '../../../model/schema-api.types';

type OpplysningerProps = {
    opplysninger: Hendelse['opplysninger_v4'];
};

const Opplysninger: React.FC<OpplysningerProps> = (props) => {
    const { opplysninger } = props;
    // Tror det er en feil på "velg den situasjonen som passer deg best"
    // Mulig vi kan legge til nåværende stilling (ikke brukt til noe, men vi har jo dataen 🤷‍♀️)
    // Vurdere å lage en egen mapOpplysninger for å bruke nye typer
    const opplysningerFormatted = mapOpplysninger(opplysninger as any);
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
