import React from 'react';
import { Opplysninger } from './hendelseTyper/opplysninger';
import { PeriodeAvsluttet } from './hendelseTyper/periodeAvsluttet';
import { HistorikkHeading } from './historikk-heading';
import { Bekreftelse } from './hendelseTyper/bekreftelse';
import { getSourceString } from './helpers';
import { Hendelse, lagHentTekstForSprak, Tidslinje } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../tidslinjer/text';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../lib/date-utils';
import { Source } from './source';

type HistorikkProps = {
    tidslinje: Tidslinje;
};
/**
 * Historikk viser alle hendelser som har skjedd for en person baset på data fra
 * tidslinje-apiet.
 */
const Historikk: React.FC<HistorikkProps> = (props) => {
    const { tidslinje } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    const getItemTitle = (hendelse: Hendelse) => {
        if (hendelse.hendelseType === 'profilering_v1') {
            return `Profilering: ${tekst(hendelse?.['profileringV1'].profilertTil)}`;
        }
        if (hendelse.hendelseType === 'bekreftelse_v1') {
            return `${tekst(hendelse.hendelseType)} - Status: ${hendelse?.['bekreftelseV1'].status?.toLowerCase()}`;
        }
        return tekst(hendelse.hendelseType);
    };

    return (
        <section>
            <HistorikkHeading tidslinje={tidslinje} />

            {tidslinje.hendelser.map((hendelse, index) => (
                <article
                    key={index + hendelse.tidspunkt}
                    className="flex flex-col gap-2 bg-gray-50/40 mb-4 p-4 rounded-md shadow print:border-b print:rounded-none"
                >
                    <div className="grid sm:flex sm:flex-wrap gap-2">
                        <div className="whitespace-nowrap pr-2">
                            {prettyPrintDatoOgKlokkeslettKortform(hendelse.tidspunkt, 'nb', true)}
                        </div>
                        <h3 className="whitespace-nowrap sm:border-l-2 border-gray-600 sm:pl-3">
                            {getItemTitle(hendelse)}
                        </h3>
                        <Source source={getSourceString(hendelse)} />
                    </div>

                    {hendelse.hendelseType === 'opplysninger_v4' && (
                        <Opplysninger opplysninger={hendelse['opplysningerV4']} />
                    )}
                    {hendelse.hendelseType === 'bekreftelse_v1' && (
                        <Bekreftelse bekreftelse={hendelse['bekreftelseV1']} />
                    )}
                    {hendelse.hendelseType === 'periode_avsluttet_v1' && (
                        <PeriodeAvsluttet avsluttetHendelse={hendelse['periodeAvsluttetV1']} />
                    )}
                </article>
            ))}
        </section>
    );
};

export { Historikk };
