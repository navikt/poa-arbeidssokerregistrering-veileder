import { lagHentTekstForSprak, OpplysningerOmArbeidssoker, Sprak } from '@navikt/arbeidssokerregisteret-utils';

import { Accordion, Heading } from '@navikt/ds-react';
import React from 'react';
import { OpplysningerMedProfilering } from '../../types/aggregerte-perioder';
import { prettyPrintDato } from '../../lib/date-utils';
import { OpplysningerKomponent } from '../opplysninger-om-arbeidssoker-komponent';
import ProfileringKomponent from './profilering';

const TEKSTER = {
    nb: {
        sendtInn: 'Sendt inn ',
    },
};
interface Props extends React.HTMLProps<any> {
    opplysningerOmArbeidssoker: OpplysningerMedProfilering[];
    sprak: Sprak;
}

export function OpplysningerHistorikk(props: Props) {
    const { opplysningerOmArbeidssoker, sprak } = props;

    if (!opplysningerOmArbeidssoker || opplysningerOmArbeidssoker.length === 0) return null;

    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    return (
        <div className={props.className ?? ''}>
            <Heading level="2" size="medium">
                Registrerte opplysninger og profileringsresultat
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
                                <ProfileringKomponent profilering={opplysninger.profilering} />
                            </Accordion.Content>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </div>
    );
}
