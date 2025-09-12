import React from 'react';
import { Tidslinje as TidslinjeData } from '../../model/tidslinjer';
import { Opplysninger } from './hendelseTyper/opplysninger';
import {
    BekreftelseV1Hendelse,
    OpplysningerV4Hendelse,
    PaVegneAvStoppV1Hendelse,
    PeriodeAvsluttetV1Hendelse,
    PeriodeStartetV1Hendelse,
    ProfileringV1Hendelse,
} from './tidslinjer.types';
import { PeriodeStart } from './hendelseTyper/periodeStart';
import { Profilering } from './hendelseTyper/pofilering';
import { PeriodeAvsluttet } from './hendelseTyper/periodeAvsluttet';
import { PaVegneAvStoppet } from './hendelseTyper/paVegeneAvStoppet';
import { HistorikkHeading } from './historikk-heading';
import { HistorikkInnslagWrapper } from './historikk-innslag-wrapper';
import { Bekreftelse } from './hendelseTyper/bekreftelse';

type HistorikkProps = {
    tidslinje: TidslinjeData;
};

const Historikk: React.FC<HistorikkProps> = (props) => {
    const { tidslinje } = props;

    return (
        <section>
            <HistorikkHeading tidslinje={tidslinje} />

            {tidslinje.hendelser.map((hendelse, index) => (
                <HistorikkInnslagWrapper key={index + hendelse.tidspunkt}>
                    <>
                        {hendelse.hendelseType === 'opplysninger_v4' && (
                            <Opplysninger opplysninger={hendelse as OpplysningerV4Hendelse} />
                        )}
                        {hendelse.hendelseType === 'periode_startet_v1' && (
                            <PeriodeStart periode={hendelse as PeriodeStartetV1Hendelse} />
                        )}
                        {hendelse.hendelseType === 'profilering_v1' && (
                            <Profilering profilering={hendelse as ProfileringV1Hendelse} />
                        )}
                        {hendelse.hendelseType === 'pa_vegne_av_stopp_v1' && (
                            <PaVegneAvStoppet stoppetHendelse={hendelse as PaVegneAvStoppV1Hendelse} />
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
