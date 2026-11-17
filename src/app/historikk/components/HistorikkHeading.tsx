import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Hendelse, Periode, PeriodeAvsluttetHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyLong, Box, CopyButton, HStack, InfoCard, VStack } from '@navikt/ds-react';
import type React from 'react';
import { TEKSTER } from '@/app/historikk/components/text';
import { prettyPrintDato } from '@/lib/date-utils';
import { oversettSluttaarsak } from '@/lib/oversett-sluttaarsak';
import styles from './Historikk.module.css';

type HistorikkHeadingProps = {
    periode: Periode;
};

const KopierVeilederId = ({ veilederId }: { veilederId: string | null }) => {
    return (
        <>
            {' '}
            (id: {veilederId})
            <CopyButton copyText={veilederId || ''} size='small' title='Kopier id' />
        </>
    );
};

const PeriodeStartInfo = ({ event }: { event: Hendelse | undefined }) => {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const utfoertAv = event?.type === 'PERIODE_STARTET_V1' ? event.sendtInnAv.utfoertAv : null;

    if (!event) return null;

    return (
        <HStack as='p' align='center'>
            <strong>Startet</strong>&nbsp;av {tekst(utfoertAv?.type || '')}
            {utfoertAv?.type === 'VEILEDER' && <KopierVeilederId veilederId={utfoertAv.id} />}
        </HStack>
    );
};

const PeriodeSluttInfo = ({ event }: { event: PeriodeAvsluttetHendelse | undefined }) => {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const sluttaarsak = oversettSluttaarsak('nb');

    if (!event) return null;

    return (
        <>
            <HStack as='p' align='center'>
                <b>Avsluttet</b>&nbsp;av {tekst(event.sendtInnAv.utfoertAv.type)}
                {event.sendtInnAv.utfoertAv.type === 'VEILEDER' && (
                    <KopierVeilederId veilederId={event.sendtInnAv.utfoertAv.id} />
                )}
            </HStack>
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
        <Box marginBlock='space-0 space-32'>
            <InfoCard data-color='info'>
                <InfoCard.Header>
                    <InfoCard.Title>
                        {prettyPrintDato(periode.startet, 'nb', true)} -{' '}
                        {periode.avsluttet ? prettyPrintDato(periode.avsluttet, 'nb', true) : 'fortsatt pågående'}
                    </InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>
                    <Box marginBlock='space-0 space-16'>
                        <BodyLong size='medium' className={styles.hendelseMeta}>
                            <span>{periode.hendelser.length} hendelser</span>
                            <span>&#8226;</span>
                            <span>Perioden er {periode.avsluttet ? 'avsluttet' : 'pågående'}</span>
                        </BodyLong>
                    </Box>
                    <VStack gap='space-8'>
                        <PeriodeStartInfo event={periodeStartetEvent} />
                        <PeriodeSluttInfo event={periodeAvsluttetEvent} />
                    </VStack>
                </InfoCard.Content>
            </InfoCard>
        </Box>
    );
};

export { HistorikkHeading };
