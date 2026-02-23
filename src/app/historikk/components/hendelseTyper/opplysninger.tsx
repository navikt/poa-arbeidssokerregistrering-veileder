import { lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';
import type { OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import type React from 'react';
import { mapOpplysningerV2 } from '@/app/historikk/components/hendelseTyper/map-opplysninger-til-fremvisning';
import { ReadMoreWrapper } from '@/app/historikk/components/hendelseTyper/read-more-wrapper';

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
                {opplysningerFormatted.map((field) => (
                    <div key={field.sporsmal} className="mb-2">
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
