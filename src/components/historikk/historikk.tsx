import { Hendelse, HendelseType, lagHentTekstForSprak, Tidslinje } from '@navikt/arbeidssokerregisteret-utils';
import React from 'react';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../lib/date-utils';
import { TEKSTER } from '../tidslinjer/text';
import { getSourceString } from './helpers';
import { Bekreftelse } from './hendelseTyper/bekreftelse';
import { Opplysninger } from './hendelseTyper/opplysninger';
import { PeriodeAvsluttet } from './hendelseTyper/periodeAvsluttet';
import { Profilering } from './hendelseTyper/profilering';
import { HistorikkHeading } from './historikk-heading';
import { Source } from './source';
import { useFilterContext } from '../../contexts/hendelse-context';

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
    const { filters } = useFilterContext();

    const getItemTitle = (hendelse: Hendelse) => {
        if (hendelse.hendelseType === 'profilering_v1') {
            return `Profilering: ${tekst(hendelse?.['profileringV1'].profilertTil)}`;
        }
        if (hendelse.hendelseType === 'bekreftelse_v1') {
            return `${tekst(hendelse.hendelseType)} - Status: ${hendelse?.['bekreftelseV1'].status?.toLowerCase()}`;
        }
        if (hendelse.hendelseType === HendelseType.egenvurdering_v1) {
            return `Egenvurdering: ${tekst(hendelse.egenvurderingV1.egenvurdering)}`;
        }
        return tekst(hendelse.hendelseType);
    };

    return (
        <section id={tidslinje.periodeId}>
            <HistorikkHeading tidslinje={tidslinje} />
            {tidslinje.hendelser
                .filter((hendelse) => filters.includes(hendelse.hendelseType))
                .map((hendelse, index) => (
                    <article
                        key={index + hendelse.tidspunkt}
                        className="flex flex-col gap-2 bg-ax-neutral-100/40 mb-4 p-4 rounded-md shadow print:border-b print:rounded-none"
                    >
                        <div className="grid ax-sm:flex ax-sm:flex-wrap gap-2">
                            <div className="whitespace-nowrap pr-2">
                                {prettyPrintDatoOgKlokkeslettKortform(hendelse.tidspunkt, 'nb', true)}
                            </div>
                            <h3 className="whitespace-nowrap ax-sm:border-l-2 border-ax-neutral-700 ax-sm:pl-3 flex items-center gap-2">
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
                        {hendelse.hendelseType === HendelseType.profilering_v1 && (
                            <Profilering profilering={hendelse.profileringV1} />
                        )}
                    </article>
                ))}
        </section>
    );
};

export { Historikk };
