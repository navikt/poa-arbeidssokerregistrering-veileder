import { BodyLong, Box, CopyButton, Heading } from '@navikt/ds-react';
import React from 'react';
import { prettyPrintDato } from '../../lib/date-utils';
import { HistorikkListeTittelIkon } from './historikk-liste-tittel-ikon';
import { Tidslinje } from '../../model/tidslinjer';
import { PeriodeAvsluttetV1Hendelse, PeriodeStartetV1Hendelse } from './tidslinjer.types';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../tidslinjer/text';

type HistorikkHeadingProps = {
    tidslinje: Tidslinje;
};

const PeriodeStartInfo = ({ event }: { event: PeriodeStartetV1Hendelse | undefined }) => {
    if (!event) return null;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { utfoertAv } = event.periodeStartetV1;
    return (
        <div className="flex items-center">
            Startet av {tekst(utfoertAv.type)}
            {utfoertAv.type === 'VEILEDER' && (
                <>
                    {' '}
                    (id: {utfoertAv.id})
                    <CopyButton copyText={utfoertAv.id || ''} size="small" title="Kopier begrunnelse for opprettelse" />
                </>
            )}
        </div>
    );
};

const PeriodeSluttInfo = ({ event }: { event: PeriodeAvsluttetV1Hendelse | undefined }) => {
    if (!event) return null;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { utfoertAv } = event.periodeAvsluttetV1;
    return (
        <div className="flex items-center">
            Avsluttet av {tekst(utfoertAv.type)}
            {utfoertAv.type === 'VEILEDER' && (
                <>
                    {' '}
                    (id: {utfoertAv.id})
                    <CopyButton copyText={utfoertAv.id || ''} size="small" title="Kopier begrunnelse for opprettelse" />
                </>
            )}
        </div>
    );
};

const HistorikkHeading: React.FC<HistorikkHeadingProps> = (props) => {
    const { tidslinje } = props;
    const erAvsluttet = tidslinje.avsluttet !== null;
    const periodeStartetEvent = tidslinje.hendelser.find((h) => h.hendelseType === 'periode_startet_v1') as
        | PeriodeStartetV1Hendelse
        | undefined;
    const periodeAvsluttetEvent = tidslinje.hendelser.find((h) => h.hendelseType === 'periode_avsluttet_v1') as
        | PeriodeAvsluttetV1Hendelse
        | undefined;

    return (
        <>
            <Heading size="large" level={'2'} className="flex items-center gap-4 mb-6">
                {prettyPrintDato(tidslinje.startet, 'nb', true)} -{' '}
                {tidslinje.avsluttet ? prettyPrintDato(tidslinje.avsluttet, 'nb', true) : 'fortsatt pågående'}
                <HistorikkListeTittelIkon hendelser={tidslinje.hendelser} />
            </Heading>
            <Box background="surface-info-subtle" className="rounded-md p-4 mb-8">
                <BodyLong size="medium" className="flex flex-row gap-4 mb-4">
                    <div>{tidslinje.hendelser.length} hendelser</div>
                    <div>&#8226;</div>
                    <div>Perioden er {erAvsluttet ? 'avsluttet' : 'pågående'}</div>
                </BodyLong>
                <BodyLong size="medium">
                    <PeriodeStartInfo event={periodeStartetEvent} />
                    <PeriodeSluttInfo event={periodeAvsluttetEvent} />
                </BodyLong>
            </Box>
        </>
    );
};

export { HistorikkHeading };
