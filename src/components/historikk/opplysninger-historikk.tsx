import { lagHentTekstForSprak, Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Accordion, BodyLong, Box, Heading } from '@navikt/ds-react';
import React from 'react';

import { OpplysningerMedProfilering } from '../../types/aggregerte-perioder';
import { prettyPrintDato, prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';
import { OpplysningerKomponent } from '../opplysninger-om-arbeidssoker-komponent';
import ProfileringKomponent from './profilering';

const TEKSTER = {
    nb: {
        sendtInn: 'Sendt inn ',
        av: 'av',
        SLUTTBRUKER: 'bruker',
        SYSTEM: 'Nav',
        VEILEDER: 'veileder',
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
                                {tekst('sendtInn')} {prettyPrintDato(opplysninger.sendtInnAv.tidspunkt, sprak, true)}
                            </Accordion.Header>
                            <Accordion.Content>
                                <Box className="mb-4">
                                    <BodyLong>
                                        Sendt inn:{' '}
                                        {prettyPrintDatoOgKlokkeslett(opplysninger.sendtInnAv.tidspunkt, sprak, true)}{' '}
                                        {tekst('av')} {tekst(opplysninger.sendtInnAv.utfoertAv.type)}{' '}
                                        {opplysninger.sendtInnAv.utfoertAv.type === 'VEILEDER'
                                            ? `(${opplysninger.sendtInnAv.utfoertAv.id})`
                                            : ''}
                                    </BodyLong>
                                </Box>
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
