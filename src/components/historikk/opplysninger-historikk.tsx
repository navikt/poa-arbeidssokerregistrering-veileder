import { lagHentTekstForSprak, OpplysningerOmArbeidssoker, Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Accordion, Heading } from '@navikt/ds-react';
// import Opplysninger from '@/components/opplysninger/opplysninger';
import React from 'react';
import { prettyPrintDato } from '../../lib/date-utils';
import { OpplysningerKomponent } from '../opplysninger-om-arbeidssoker-komponent';

const TEKSTER = {
    nb: {
        sendtInn: 'Sendt inn ',
    },
};
interface Props extends React.HTMLProps<any> {
    opplysningerOmArbeidssoker: OpplysningerOmArbeidssoker[];
    sprak: Sprak;
}
export function OpplysningerHistorikk(props: Props) {
    const { opplysningerOmArbeidssoker, sprak } = props;

    if (!opplysningerOmArbeidssoker || opplysningerOmArbeidssoker.length === 0) return null;

    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    return (
        <div className={props.className ?? ''}>
            <Heading level="2" size="medium">
                Registrerte opplysninger
            </Heading>
            <Accordion>
                {opplysningerOmArbeidssoker.map((opplysninger) => {
                    return (
                        <Accordion.Item key={opplysninger.opplysningerOmArbeidssoekerId}>
                            <Accordion.Header>
                                {tekst('sendtInn')} {prettyPrintDato(opplysninger.sendtInnAv.tidspunkt)}
                            </Accordion.Header>
                            <Accordion.Content>
                                <OpplysningerKomponent opplysninger={opplysninger} />
                            </Accordion.Content>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </div>
    );
}
