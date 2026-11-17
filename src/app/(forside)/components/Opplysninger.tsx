import { lagHentTekstForSprak, SPORSMAL_TEKSTER, type Svar } from '@navikt/arbeidssokerregisteret-utils';
import type { EgenvurderingHendelse, OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyShort, Box, Button, Heading, HGrid, HStack } from '@navikt/ds-react';
import Link from 'next/link';
import { mapUtfoertAvType } from '@/app/(forside)/components/mapUtfoertAvType';
import { Valgmeny } from '@/app/(forside)/components/Valgmeny';
import { mapOpplysningerV2 } from '@/app/historikk/components/hendelseTyper/map-opplysninger-til-fremvisning';
import { prettyPrintDato } from '@/lib/date-utils';

type OpplysningProps = { sporsmal: string; svar: Svar | string };

function Opplysning({ sporsmal, svar }: OpplysningProps) {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');
    return (
        <Box marginBlock='space-0 space-20'>
            <BodyShort>
                <strong>{tekst(sporsmal)}</strong>
                <br />
                {tekst(svar as string) ?? svar}
            </BodyShort>
        </Box>
    );
}

type OpplysningerProps = {
    opplysninger: OpplysningerHendelse | undefined;
    egenvurderinger: EgenvurderingHendelse | undefined;
    sisteArbeidssoekerperiodeId: string;
};

function ManglerOpplysninger(props: OpplysningerProps) {
    const { sisteArbeidssoekerperiodeId } = props;
    return (
        <Box marginBlock='space-0 space-16'>
            <Heading level={'3'} size={'small'}>
                Opplysninger
            </Heading>
            <HStack justify='space-between' marginBlock='space-0 space-8'>
                <BodyShort textColor={'subtle'}>Ingen opplysninger registrert</BodyShort>
                <Valgmeny sisteArbeidssoekerperiodeId={sisteArbeidssoekerperiodeId} manglerOpplysninger={true} />
            </HStack>
            <Box marginBlock='space-16 space-0'>
                <Link href='/oppdater-opplysninger' passHref>
                    <Button as='a' variant={'secondary'}>
                        Legg til opplysninger
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}

function Opplysninger(props: OpplysningerProps) {
    if (!props.opplysninger) {
        return <ManglerOpplysninger {...props} />;
    }
    const { opplysninger, sisteArbeidssoekerperiodeId, egenvurderinger } = props;
    const mappedeOpplysninger = mapOpplysningerV2(opplysninger);
    const egenvurdering = egenvurderinger?.egenvurdering;

    return (
        <Box marginBlock='space-0 space-16'>
            <Heading level={'3'} size={'small'}>
                Opplysninger
            </Heading>
            <HStack justify='space-between' marginBlock='space-0 space-8'>
                <BodyShort textColor={'subtle'}>
                    Oppdatert {prettyPrintDato(props.opplysninger.sendtInnAv.tidspunkt)} av{' '}
                    {mapUtfoertAvType(props.opplysninger.sendtInnAv.utfoertAv.type)}
                </BodyShort>
                <Valgmeny sisteArbeidssoekerperiodeId={sisteArbeidssoekerperiodeId} />
            </HStack>

            <Box borderWidth={'1'} padding={'space-16'}>
                <HGrid columns={2} gap={'space-0 space-24'}>
                    {mappedeOpplysninger.map((o) => {
                        return <Opplysning {...o} key={o.sporsmal} />;
                    })}
                    {egenvurdering && <Opplysning sporsmal={'egenvurdering'} svar={`egenvurdering-${egenvurdering}`} />}
                </HGrid>
            </Box>
        </Box>
    );
}

export { Opplysninger };
