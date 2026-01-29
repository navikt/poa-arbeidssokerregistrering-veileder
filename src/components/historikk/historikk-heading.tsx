import { Hendelse, lagHentTekstForSprak, Tidslinje } from '@navikt/arbeidssokerregisteret-utils';
import { BodyLong, Box, CopyButton, Heading } from '@navikt/ds-react';
import React from 'react';
import { prettyPrintDato } from '../../lib/date-utils';
import { oversettSluttaarsak } from '../../lib/oversett-sluttaarsak';
import { TEKSTER } from '../tidslinjer/text';

type HistorikkHeadingProps = {
    tidslinje: Tidslinje;
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
    const utfoertAv = event?.['periodeStartetV1']?.utfoertAv;

    if (!event) return null;

    return (
        <p className="flex items-center">
            <strong>Startet</strong>&nbsp;av {tekst(utfoertAv.type)}
            {utfoertAv.type === 'VEILEDER' && <KopierVeilederId veilederId={utfoertAv.id} />}
        </p>
    );
};

const PeriodeSluttInfo = ({ event }: { event: Hendelse | undefined }) => {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const utfoertAv = event?.['periodeAvsluttetV1']?.utfoertAv;
    const aarsak = event?.['periodeAvsluttetV1']?.aarsak;
    const sluttaarsak = oversettSluttaarsak('nb');

    if (!event) return null;

    return (
        <>
            <p className="flex items-center">
                <b>Avsluttet</b>&nbsp;av {tekst(utfoertAv.type)}
                {utfoertAv.type === 'VEILEDER' && <KopierVeilederId veilederId={utfoertAv.id} />}
            </p>
            <p>
                <b>{tekst('sluttarsak')}</b>: {sluttaarsak(aarsak)}
            </p>
        </>
    );
};

const HistorikkHeading: React.FC<HistorikkHeadingProps> = (props) => {
    const { tidslinje } = props;
    const erAvsluttet = tidslinje.avsluttet !== null;
    const periodeStartetEvent = tidslinje.hendelser.find((h) => h.hendelseType === 'periode_startet_v1');
    const periodeAvsluttetEvent = tidslinje.hendelser.find((h) => h.hendelseType === 'periode_avsluttet_v1');

    return (
        <header className=" bg-ax-bg-info-soft rounded-md p-4 mb-8 border">
            <Heading size="large" level={'2'} className="flex items-center gap-4 mb-6">
                {prettyPrintDato(tidslinje.startet, 'nb', true)} -{' '}
                {tidslinje.avsluttet ? prettyPrintDato(tidslinje.avsluttet, 'nb', true) : 'fortsatt pågående'}
            </Heading>
            <Box>
                <BodyLong size="medium" className="flex flex-row gap-4 mb-4">
                    <span>{tidslinje.hendelser.length} hendelser</span>
                    <span>&#8226;</span>
                    <span>Perioden er {erAvsluttet ? 'avsluttet' : 'pågående'}</span>
                </BodyLong>
                <div className="flex flex-col gap-2">
                    <PeriodeStartInfo event={periodeStartetEvent} />
                    <PeriodeSluttInfo event={periodeAvsluttetEvent} />
                </div>
            </Box>
        </header>
    );
};

export { HistorikkHeading };
