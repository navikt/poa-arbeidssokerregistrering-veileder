import { Hendelse, lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';
import { ReadMore } from '@navikt/ds-react';
import React from 'react';
import { mapOpplysningerV2 } from './map-opplysninger-til-fremvisning';

type OpplysningerProps = {
    opplysninger: Hendelse['opplysningerV4'];
};

const Opplysninger: React.FC<OpplysningerProps> = (props) => {
    const { opplysninger } = props;
    const opplysningerFormatted = mapOpplysningerV2(opplysninger);
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');

    return (
        <ReadMore header="Se innsendte opplysninger">
            <div className="text-base">
                {opplysningerFormatted.map((field, i) => (
                    <div key={i} className="mb-2">
                        <strong>{tekst(field.sporsmal)}</strong>
                        <br />
                        {tekst(field.svar as string) ?? field.svar}
                    </div>
                ))}
            </div>
        </ReadMore>
    );
};

export { Opplysninger };
