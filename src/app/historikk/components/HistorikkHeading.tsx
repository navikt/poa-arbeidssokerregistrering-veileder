import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Hendelse, Periode, PeriodeAvsluttetHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyLong, CopyButton, InfoCard } from '@navikt/ds-react';
import type React from 'react';
import { TEKSTER } from '@/components/tidslinjer/text';
import { prettyPrintDato } from '@/lib/date-utils';
import { oversettSluttaarsak } from '@/lib/oversett-sluttaarsak';

type HistorikkHeadingProps = {
    periode: Periode;
};

const KopierVeilederId = ({ veilederId }: { veilederId: string | null }) => {
    return (
        <>
            {' '}
            (id: {veilederId})
            <CopyButton copyText={veilederId || ''} size="small" title="Kopier id" />
        </>
    );
};

const PeriodeStartInfo = ({ event }: { event: Hendelse | undefined }) => {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const utfoertAv = event?.type === 'PERIODE_STARTET_V1' ? event.sendtInnAv.utfoertAv : null;

    if (!event) return null;

    return (
        <p className="flex items-center">
            <strong>Startet</strong>&nbsp;av {tekst(utfoertAv?.type || '')}
            {utfoertAv?.type === 'VEILEDER' && <KopierVeilederId veilederId={utfoertAv.id} />}
        </p>
    );
};

const PeriodeSluttInfo = ({ event }: { event: PeriodeAvsluttetHendelse | undefined }) => {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const sluttaarsak = oversettSluttaarsak('nb');

    if (!event) return null;

    return (
        <>
            <p className="flex items-center">
                <b>Avsluttet</b>&nbsp;av {tekst(event.sendtInnAv.utfoertAv.type)}
                {event.sendtInnAv.utfoertAv.type === 'VEILEDER' && (
                    <KopierVeilederId veilederId={event.sendtInnAv.utfoertAv.id} />
                )}
            </p>
            <p>
                <b>{tekst('sluttarsak')}</b>: {sluttaarsak(event.sendtInnAv.aarsak)}
            </p>
        </>
    );
};

const HistorikkHeading: React.FC<HistorikkHeadingProps> = (props) => {
    const { periode } = props;
    const periodeStartetEvent = periode.hendelser.find((h) => h.type === 'PERIODE_STARTET_V1');
    const periodeAvsluttetEvent = periode.hendelser.find((h) => h.type === 'PERIODE_AVSLUTTET_V1');

    return (
        <InfoCard data-color="info" className="mb-8">
            <InfoCard.Header>
                <InfoCard.Title>
                    {prettyPrintDato(periode.startet, 'nb', true)} -{' '}
                    {periode.avsluttet ? prettyPrintDato(periode.avsluttet, 'nb', true) : 'fortsatt pågående'}
                </InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
                <BodyLong size="medium" className="flex flex-row gap-4 mb-4">
                    <span>{periode.hendelser.length} hendelser</span>
                    <span>&#8226;</span>
                    <span>Perioden er {periode.avsluttet ? 'avsluttet' : 'pågående'}</span>
                </BodyLong>
                <div className="flex flex-col gap-2">
                    <PeriodeStartInfo event={periodeStartetEvent} />
                    <PeriodeSluttInfo event={periodeAvsluttetEvent} />
                </div>
            </InfoCard.Content>
        </InfoCard>
    );
};

export { HistorikkHeading };
