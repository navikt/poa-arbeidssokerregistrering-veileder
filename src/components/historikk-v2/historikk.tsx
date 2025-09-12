import React from 'react';
import { Opplysninger } from './hendelseTyper/opplysninger';
import {
    BekreftelseV1Hendelse,
    OpplysningerV4Hendelse,
    PeriodeAvsluttetV1Hendelse,
    ProfileringV1Hendelse,
    Tidslinje,
} from './models/tidslinjer.types';
import { Profilering } from './hendelseTyper/pofilering';
import { PeriodeAvsluttet } from './hendelseTyper/periodeAvsluttet';
import { HistorikkHeading } from './historikk-heading';
import { HistorikkInnslagWrapper } from './historikk-innslag-wrapper';
import { Bekreftelse } from './hendelseTyper/bekreftelse';
import { getSourceString } from './helpers';
import { HistorikkInnslagHeader } from './historikk-innslag-header';

type HistorikkProps = {
    tidslinje: Tidslinje;
};

const Historikk: React.FC<HistorikkProps> = (props) => {
    const { tidslinje } = props;

    return (
        <section>
            <HistorikkHeading tidslinje={tidslinje} />

            {tidslinje.hendelser.map((hendelse, index) => (
                <HistorikkInnslagWrapper key={index + hendelse.tidspunkt}>
                    <>
                        <HistorikkInnslagHeader
                            date={hendelse.tidspunkt}
                            title={hendelse.hendelseType}
                            source={getSourceString(hendelse)}
                        />
                        {hendelse.hendelseType === 'opplysninger_v4' && (
                            <Opplysninger opplysninger={hendelse as OpplysningerV4Hendelse} />
                        )}
                        {hendelse.hendelseType === 'profilering_v1' && (
                            <Profilering profilering={hendelse as ProfileringV1Hendelse} />
                        )}
                        {hendelse.hendelseType === 'bekreftelse_v1' && (
                            <Bekreftelse bekreftelse={hendelse as BekreftelseV1Hendelse} />
                        )}
                        {hendelse.hendelseType === 'periode_avsluttet_v1' && (
                            <PeriodeAvsluttet avsluttetHendelse={hendelse as PeriodeAvsluttetV1Hendelse} />
                        )}
                    </>
                </HistorikkInnslagWrapper>
            ))}
        </section>
    );
};

export { Historikk };
