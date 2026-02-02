import { Hendelse, lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';
import React from 'react';
import { mapOpplysningerV2 } from './map-opplysninger-til-fremvisning';
import { ReadMoreWrapper } from './read-more-wrapper';
import { OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type OpplysningerProps = {
    opplysninger: OpplysningerHendelse;
};

const Opplysninger: React.FC<OpplysningerProps> = (props) => {
    const { opplysninger } = props;
    const opplysningerFormatted = mapOpplysningerV2(opplysninger);
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');

    return (
        <ReadMoreWrapper header="Se innsendte opplysninger">
            <div className="text-base">
                {opplysningerFormatted.map((field, i) => (
                    <div key={i} className="mb-2">
                        <strong>{tekst(field.sporsmal)}</strong>
                        <br />
                        {tekst(field.svar as string) ?? field.svar}
                    </div>
                ))}
            </div>
        </ReadMoreWrapper>
    );
};

export { Opplysninger };
