import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
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
import { Hendelse, Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type HistorikkProps = {
    periode: Periode;
};
/**
 * Historikk viser alle hendelser som har skjedd for en person baset på data fra perioder
 */
const Historikk: React.FC<HistorikkProps> = (props) => {
    const { periode } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { filters } = useFilterContext();

    const getItemTitle = (hendelse: Hendelse) => {
        if (hendelse.type === 'PROFILERING_V1') {
            return `Profilering: ${tekst(hendelse.profilertTil)}`;
        }
        if (hendelse.type === 'BEKREFTELSE_V1') {
            return `${tekst(hendelse.type)} - Status: ${hendelse.status.toLowerCase()}`;
        }
        if (hendelse.type === 'EGENVURDERING_V1') {
            return `Egenvurdering: ${tekst(hendelse.egenvurdering)}`;
        }
        return tekst(hendelse.type);
    };

    return (
        <section id={periode.periodeId}>
            <HistorikkHeading periode={periode} />
            {periode.hendelser
                .filter((hendelse) => filters.includes(hendelse.type))
                .map((hendelse, index) => (
                    <article
                        key={index}
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
                        {hendelse.type === 'OPPLYSNINGER_V4' && <Opplysninger opplysninger={hendelse} />}
                        {hendelse.type === 'BEKREFTELSE_V1' && <Bekreftelse bekreftelse={hendelse} />}
                        {hendelse.type === 'PERIODE_AVSLUTTET_V1' && <PeriodeAvsluttet avsluttetHendelse={hendelse} />}
                        {hendelse.type === 'PROFILERING_V1' && <Profilering profilering={hendelse} />}
                    </article>
                ))}
        </section>
    );
};

export { Historikk };
