import React from 'react';
import { List, ReadMore } from '@navikt/ds-react';
import { mapOpplysninger } from '../../opplysninger-om-arbeidssoker-komponent';
import { lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';
import { Hendelse } from '../../../model/schema-api.types';
import { mapOpplysningerV2 } from './map-opplysninger-til-fremvisning';

type OpplysningerProps = {
    opplysninger: Hendelse['opplysninger_v4'];
};

const Opplysninger: React.FC<OpplysningerProps> = (props) => {
    const { opplysninger } = props;
    const opplysningerFormatted = mapOpplysningerV2(opplysninger);
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
