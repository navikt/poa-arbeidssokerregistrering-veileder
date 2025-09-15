import React from 'react';
import { Opplysninger } from './hendelseTyper/opplysninger';
import { Profilering } from './hendelseTyper/pofilering';
import { PeriodeAvsluttet } from './hendelseTyper/periodeAvsluttet';
import { HistorikkHeading } from './historikk-heading';
import { HistorikkInnslagWrapper } from './historikk-innslag-wrapper';
import { Bekreftelse } from './hendelseTyper/bekreftelse';
import { getSourceString } from './helpers';
import { HistorikkInnslagHeader } from './historikk-innslag-header';
import { Tidslinje } from '../../model/schema-api.types';

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
                            <Opplysninger opplysninger={hendelse['opplysningerV4']} />
                        )}
                        {hendelse.hendelseType === 'profilering_v1' && (
                            <Profilering profilering={hendelse['profileringV1']} />
                        )}
                        {hendelse.hendelseType === 'bekreftelse_v1' && (
                            <Bekreftelse bekreftelse={hendelse['bekreftelseV1']} />
                        )}
                        {hendelse.hendelseType === 'periode_avsluttet_v1' && (
                            <PeriodeAvsluttet avsluttetHendelse={hendelse['periodeAvsluttetV1']} />
                        )}
                    </>
                </HistorikkInnslagWrapper>
            ))}
        </section>
    );
};

export { Historikk };
