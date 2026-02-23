import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Hendelse, Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import type React from 'react';
import { useFilterContext } from '@/app/contexts/filter-hendelse-context';
import { HistorikkHeading } from '@/app/historikk/components/HistorikkHeading';
import { getSourceString } from '@/app/historikk/components/helpers';
import { Bekreftelse } from '@/app/historikk/components/hendelseTyper/bekreftelse';
import { Opplysninger } from '@/app/historikk/components/hendelseTyper/opplysninger';
import { PeriodeAvsluttet } from '@/app/historikk/components/hendelseTyper/periodeAvsluttet';
import { Profilering } from '@/app/historikk/components/hendelseTyper/profilering';
import { Source } from '@/app/historikk/components/Source';
import { TEKSTER } from '@/components/tidslinjer/text';
import { prettyPrintDatoOgKlokkeslettKortform } from '@/lib/date-utils';

type HistorikkProps = {
    periode: Periode;
};
/**
 * Historikk viser alle hendelser som har skjedd for en person baset på data fra perioder
 */
const HistorikkPeriode: React.FC<HistorikkProps> = (props) => {
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
                        key={`${index}-${hendelse.tidspunkt}`}
                        className='flex flex-col gap-2 bg-ax-neutral-100/40 mb-4 p-4 rounded-md shadow print:border-b print:rounded-none'
                    >
                        <div className='grid ax-sm:flex ax-sm:flex-wrap gap-2'>
                            <div className='whitespace-nowrap pr-2'>
                                {prettyPrintDatoOgKlokkeslettKortform(hendelse.tidspunkt, 'nb', true)}
                            </div>
                            <h3 className='whitespace-nowrap ax-sm:border-l-2 border-ax-neutral-700 ax-sm:pl-3 flex items-center gap-2'>
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

export { HistorikkPeriode };
