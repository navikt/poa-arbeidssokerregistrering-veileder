import { Hendelse, lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';
import { ReadMore } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { mapOpplysningerV2 } from './map-opplysninger-til-fremvisning';
import { useVisningTypeContext } from '../../../contexts/hendelse-visning-context';

type OpplysningerProps = {
    opplysninger: Hendelse['opplysningerV4'];
};

const Opplysninger: React.FC<OpplysningerProps> = (props) => {
    const { opplysninger } = props;
    const [open, setOpen] = useState(false);
    const opplysningerFormatted = mapOpplysningerV2(opplysninger);
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');
    const { visningsType } = useVisningTypeContext();

    useEffect(() => {
        if (visningsType === 'expanded') {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [visningsType]);

    return (
        <ReadMore header="Se innsendte opplysninger" onOpenChange={() => setOpen(!open)} open={open}>
            <div className="text-base">
                type er: {visningsType}
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
