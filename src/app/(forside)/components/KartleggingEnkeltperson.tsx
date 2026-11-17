import { ProfilertTil } from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyShort, Box, HGrid, HStack, InfoCard, Tag } from '@navikt/ds-react';
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from '@navikt/ds-react/InfoCard';
import { daysSinceDate, prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { DagerTag, JaNeiTag, NeiJaTag } from './kartlegging/ArbeidssokerRad';
import { BEKREFTELSE_LABEL } from './kartlegging/constants';
import { mapUtfoertAvType } from './mapUtfoertAvType';

type KartleggingProps = {
    arbeidssoker: ArbeidssokerKompakt | null;
    snapshot: Snapshot;
};

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Box
            paddingBlock='space-0 space-8'
            marginBlock='space-0 space-8'
            borderWidth='0 0 1 0'
            borderColor='neutral-subtle'
        >
            <HGrid columns={{ xs: 1, md: 'minmax(0, 1fr) 210px' }} gap='space-8 space-0'>
                {children}
            </HGrid>
        </Box>
    );
}

function KartleggingEnkeltperson({ arbeidssoker, snapshot }: KartleggingProps) {
    const aktivPeriode = arbeidssoker?.ledighetsperioder[0];

    if (!arbeidssoker)
        return (
            <Box marginBlock='space-0 space-16'>
                <InfoCard data-color='info'>
                    <InfoCardHeader>
                        <InfoCardTitle>Personen er registrert som arbeidssøker</InfoCardTitle>
                        <BodyShort textColor={'subtle'}>
                            Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                            {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                        </BodyShort>
                    </InfoCardHeader>
                </InfoCard>
            </Box>
        );
    return (
        <Box marginBlock='space-0 space-16'>
            <InfoCard data-color='info'>
                <InfoCardHeader>
                    <InfoCardTitle>Personen er registrert som arbeidssøker</InfoCardTitle>
                    <BodyShort textColor={'subtle'}>
                        Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                        {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                    </BodyShort>
                </InfoCardHeader>
                <InfoCardContent>
                    <Wrapper>
                        <Box minWidth='0'>Dager helt ledig</Box>
                        <Box minWidth='0'>
                            <DagerTag dager={daysSinceDate(aktivPeriode?.ledigSiden || new Date())} />
                        </Box>
                    </Wrapper>
                    <Wrapper>
                        <Box minWidth='0'>Bekreftelser kommer fra</Box>
                        <HStack minWidth='0' gap='space-8' wrap>
                            {aktivPeriode?.bekreftelsePaaVegneAv.map((e) => (
                                <Tag key={e} size='small'>
                                    {BEKREFTELSE_LABEL[e]}
                                </Tag>
                            ))}
                        </HStack>
                    </Wrapper>
                    <Wrapper>
                        <HStack minWidth='0' align='center' gap='space-4'>
                            <div>Ønsker veileder</div>
                        </HStack>
                        <Box minWidth='0'>
                            {aktivPeriode?.egenvurdertTil ? (
                                <NeiJaTag svar={aktivPeriode.egenvurdertTil === ProfilertTil.ANTATT_GODE_MULIGHETER} />
                            ) : (
                                'Mangler egenvurdering'
                            )}
                        </Box>
                    </Wrapper>
                    <Wrapper>
                        <HStack minWidth='0' align='center' gap='space-4'>
                            <div>Rapportert arbeid på siste bekreftelse</div>
                        </HStack>
                        <Box minWidth='0'>
                            {aktivPeriode ? <JaNeiTag svar={aktivPeriode?.bekreftelseHarJobbet} /> : 'MANGLER DATA'}
                        </Box>
                    </Wrapper>
                </InfoCardContent>
            </InfoCard>
        </Box>
    );
}

export { KartleggingEnkeltperson };
