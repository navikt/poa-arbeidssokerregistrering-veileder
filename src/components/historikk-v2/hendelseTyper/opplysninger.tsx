import React from 'react';
import { OpplysningerV4Hendelse } from '../tidslinjer.types';
import { List, ReadMore } from '@navikt/ds-react';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../../lib/date-utils';
import { mapOpplysninger, OpplysningerKomponent } from '../../opplysninger-om-arbeidssoker-komponent';
import { lagHentTekstForSprak, SPORSMAL_TEKSTER } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../../tidslinjer/text';
import { HistorikkInnslagHeader } from '../historikk-innslag-header';

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
        <div>
            <HistorikkInnslagHeader
                date={opplysninger.tidspunkt}
                title={opplysninger.hendelseType}
                source={opplysninger.opplysningerV4.sendtInnAv.utfoertAv.type}
            />
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
        </div>
    );
};

export { Opplysninger };
