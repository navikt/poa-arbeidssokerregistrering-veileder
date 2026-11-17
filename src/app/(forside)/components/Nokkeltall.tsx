import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Alert, BodyShort, Box, Detail, Heading, HGrid, HStack, InfoCard, Tag } from '@navikt/ds-react';
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from '@navikt/ds-react/InfoCard';
import type { NokkeltallResult } from '@/lib/api/nokkeltall';
import { prettyPrintDato, prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';
import { mapUtfoertAvType } from './mapUtfoertAvType';

const KILDER = {
    nb: {
        ARBEIDSSOEKERREGISTERET: 'Arbeidssøkerregisteret',
        FRISKMELDT_TIL_ARBEIDSFORMIDLING: 'Sykepenger',
        DAGPENGER: 'Dagpenger',
    },
};

type NokkeltallProps = {
    nokkeltall: NokkeltallResult | null;
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
            <HGrid columns='1fr 210px'>{children}</HGrid>
        </Box>
    );
}

function Dager({ dager }: { dager: number | null }) {
    if (!dager) return <Tag>0 dager</Tag>;
    if (dager >= 130) return <Tag data-color='danger'>{dager} dager</Tag>;
    if (dager >= 90) return <Tag data-color='warning'>{dager} dager</Tag>;
    return <Tag>{dager} dager</Tag>;
}

function Nokkeltall({ nokkeltall, snapshot }: NokkeltallProps) {
    const tekst = lagHentTekstForSprak(KILDER, 'nb');

    if (!nokkeltall)
        return (
            <Box marginBlock='space-0 space-16'>
                <Alert variant={'info'}>
                    <Heading level={'3'} size={'small'}>
                        Personen er registrert som arbeidssøker
                    </Heading>
                    <BodyShort textColor={'subtle'}>
                        Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                        {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                    </BodyShort>
                </Alert>
            </Box>
        );
    return (
        <Box marginBlock='space-0 space-16'>
            <InfoCard data-color='info'>
                <InfoCardHeader>
                    <InfoCardTitle>
                        Personen er registrert som arbeidssøker
                        <BodyShort textColor={'subtle'}>
                            Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                            {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                        </BodyShort>
                    </InfoCardTitle>
                </InfoCardHeader>
                <InfoCardContent>
                    <Wrapper>
                        <div>Dager helt ledig</div>
                        <div>
                            <Dager dager={nokkeltall.dagerUtenArbeid} />
                        </div>
                    </Wrapper>
                    <Wrapper>
                        <div>Bekreftelser kommer fra</div>
                        <HStack gap='space-8'>
                            {nokkeltall.tilhorighet.map((el) => (
                                <Tag key={el}>{tekst(el)}</Tag>
                            ))}
                        </HStack>
                    </Wrapper>
                    <Wrapper>
                        <HStack align='center' gap='space-4'>
                            <div>Ønsker veileder</div>
                            {nokkeltall.onskerHjelp?.dato && (
                                <Detail>({prettyPrintDato(nokkeltall.onskerHjelp?.dato)})</Detail>
                            )}
                        </HStack>
                        <div>
                            {nokkeltall.onskerHjelp ? (
                                <Tag data-color={nokkeltall.onskerHjelp.svar ? 'warning' : 'success'}>
                                    {nokkeltall.onskerHjelp?.svar ? 'Ja' : 'Nei'}
                                </Tag>
                            ) : (
                                <span>Ingen egenvurdering funnet</span>
                            )}
                        </div>
                    </Wrapper>
                    <Wrapper>
                        <HStack align='center' gap='space-4'>
                            <div>Rapportert arbeid på siste bekreftelse</div>
                            {nokkeltall.bekreftelse?.tidspunkt && (
                                <Detail>({prettyPrintDato(nokkeltall.bekreftelse.tidspunkt)})</Detail>
                            )}
                        </HStack>
                        <div>
                            {nokkeltall.bekreftelse ? (
                                nokkeltall.bekreftelse?.svar.harJobbetIDennePerioden ? (
                                    <Tag data-color='success'>Ja</Tag>
                                ) : (
                                    <Tag data-color='warning'>Nei</Tag>
                                )
                            ) : (
                                <span>Ingen bekreftelse funnet</span>
                            )}
                        </div>
                    </Wrapper>
                </InfoCardContent>
            </InfoCard>
        </Box>
    );
}

export { Nokkeltall };
