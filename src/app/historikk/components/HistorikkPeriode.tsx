import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Hendelse, Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Box, Stack, VStack } from '@navikt/ds-react';
import type React from 'react';
import { HendelseHelpText } from '@/app/historikk/components/HendelseHelpText';
import { HistorikkHeading } from '@/app/historikk/components/HistorikkHeading';
import { getSourceString } from '@/app/historikk/components/helpers';
import { Bekreftelse } from '@/app/historikk/components/hendelseTyper/bekreftelse';
import { Opplysninger } from '@/app/historikk/components/hendelseTyper/opplysninger';
import { PeriodeAvsluttet } from '@/app/historikk/components/hendelseTyper/periodeAvsluttet';
import { Profilering } from '@/app/historikk/components/hendelseTyper/profilering';
import { Source } from '@/app/historikk/components/Source';
import { TEKSTER } from '@/app/historikk/components/text';
import { useFilterContext } from '@/contexts/filter-hendelse-context';
import { prettyPrintDatoOgKlokkeslettKortform } from '@/lib/date-utils';
import styles from './Historikk.module.css';

type HistorikkProps = {
    periode: Periode;
};

function getHendelseModifier(hendelse: Hendelse): string | undefined {
    if (hendelse.type === 'PAA_VEGNE_AV_STOPP_V1' && hendelse.fristBrutt) {
        return 'FRIST_BRUTT';
    }
    return undefined;
}

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
                .map((hendelse) => (
                    <Box
                        as='article'
                        key={`${hendelse.tidspunkt}_${hendelse.type}`}
                        background='neutral-softA'
                        marginBlock='space-0 space-16'
                        padding='space-16'
                        borderRadius='8'
                        className={styles.hendelseKort}
                    >
                        <VStack gap='space-8'>
                            <Stack direction={{ xs: 'column', sm: 'row' }} wrap gap='space-8'>
                                <Box paddingInline='space-0 space-8' className={styles.hendelseDato}>
                                    {prettyPrintDatoOgKlokkeslettKortform(hendelse.tidspunkt, 'nb', true)}
                                </Box>
                                <Stack as='h3' gap='space-8' align='center' className={styles.hendelseTittel}>
                                    {getItemTitle(hendelse)}
                                </Stack>
                                <HendelseHelpText
                                    type={hendelse.type}
                                    source={getSourceString(hendelse)}
                                    modifier={getHendelseModifier(hendelse)}
                                />
                                <Source source={getSourceString(hendelse)} />
                            </Stack>
                            {hendelse.type === 'OPPLYSNINGER_V4' && <Opplysninger opplysninger={hendelse} />}
                            {hendelse.type === 'BEKREFTELSE_V1' && <Bekreftelse bekreftelse={hendelse} />}
                            {hendelse.type === 'PERIODE_AVSLUTTET_V1' && (
                                <PeriodeAvsluttet avsluttetHendelse={hendelse} />
                            )}
                            {hendelse.type === 'PROFILERING_V1' && <Profilering profilering={hendelse} />}
                        </VStack>
                    </Box>
                ))}
        </section>
    );
};

export { HistorikkPeriode };
