import { BodyLong, Box, CopyButton, Heading } from '@navikt/ds-react';
import React from 'react';
import { prettyPrintDato } from '../../lib/date-utils';
import { HistorikkListeTittelIkon } from './historikk-liste-tittel-ikon';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../tidslinjer/text';
import { oversettSluttaarsak } from '../../lib/oversett-sluttaarsak';
import { Hendelse, Tidslinje } from '../../model/schema-api.types';

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
    if (!event) return null;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { utfoertAv } = event['periodeStartetV1'];
    return (
        <div className="flex items-center">
            <strong>Startet</strong>&nbsp;av {tekst(utfoertAv.type)}
            {utfoertAv.type === 'VEILEDER' && <KopierVeilederId veilederId={utfoertAv.id} />}
        </div>
    );
};

const PeriodeSluttInfo = ({ event }: { event: Hendelse | undefined }) => {
    if (!event) return null;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { utfoertAv, aarsak } = event['periodeAvsluttetV1'];
    const sluttaarsak = oversettSluttaarsak('nb');
    return (
        <>
            <div className="flex items-center">
                <b>Avsluttet</b>&nbsp;av {tekst(utfoertAv.type)}
                {utfoertAv.type === 'VEILEDER' && <KopierVeilederId veilederId={utfoertAv.id} />}
            </div>
            <div>
                <b>{tekst('sluttarsak')}</b>: {sluttaarsak(aarsak)}
            </div>
        </>
    );
};

const HistorikkHeading: React.FC<HistorikkHeadingProps> = (props) => {
    const { tidslinje } = props;
    const erAvsluttet = tidslinje.avsluttet !== null;
    const periodeStartetEvent = tidslinje.hendelser.find((h) => h.hendelseType === 'periode_startet_v1');
    const periodeAvsluttetEvent = tidslinje.hendelser.find((h) => h.hendelseType === 'periode_avsluttet_v1');

    return (
        <header className=" bg-surface-info-subtle rounded-md p-4 mb-8 border">
            <Heading size="large" level={'2'} className="flex items-center gap-4 mb-6">
                {prettyPrintDato(tidslinje.startet, 'nb', true)} -{' '}
                {tidslinje.avsluttet ? prettyPrintDato(tidslinje.avsluttet, 'nb', true) : 'fortsatt pågående'}
                <HistorikkListeTittelIkon hendelser={tidslinje.hendelser} />
            </Heading>
            <Box>
                <BodyLong size="medium" className="flex flex-row gap-4 mb-4">
                    <div>{tidslinje.hendelser.length} hendelser</div>
                    <div>&#8226;</div>
                    <div>Perioden er {erAvsluttet ? 'avsluttet' : 'pågående'}</div>
                </BodyLong>
                <BodyLong size="medium" className="flex flex-col gap-1">
                    <PeriodeStartInfo event={periodeStartetEvent} />
                    <PeriodeSluttInfo event={periodeAvsluttetEvent} />
                </BodyLong>
            </Box>
        </header>
    );
};

export { HistorikkHeading };
