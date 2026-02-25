import { lagHentTekstForSprak, SPORSMAL_TEKSTER, type Svar } from '@navikt/arbeidssokerregisteret-utils';
import type { EgenvurderingHendelse, OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyShort, Box, Button, Heading, HGrid } from '@navikt/ds-react';
import Link from 'next/link';
import { mapOpplysningerV2 } from '@/app/historikk/components/hendelseTyper/map-opplysninger-til-fremvisning';
import { mapUtfoertAvType } from '@/components/forside/mapUtfoertAvType';
import Valgmeny from '@/components/forside/valgmeny';
import { prettyPrintDato } from '@/lib/date-utils';

type OpplysningProps = { sporsmal: string; svar: Svar | string };

function Opplysning({ sporsmal, svar }: OpplysningProps) {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');
    return (
        <div className={'mb-5'}>
            <BodyShort>
                <strong>{tekst(sporsmal)}</strong>
                <br />
                {tekst(svar as string) ?? svar}
            </BodyShort>
        </div>
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
        <Box className={'mb-4'}>
            <Heading level={'3'} size={'small'}>
                Opplysninger
            </Heading>
            <div className={'flex place-content-between mb-2'}>
                <BodyShort textColor={'subtle'}>Ingen opplysninger registrert</BodyShort>
                <Valgmeny sisteArbeidssoekerperiodeId={sisteArbeidssoekerperiodeId} manglerOpplysninger={true} />
            </div>
            <div className={'mt-4'}>
                <Link href='/oppdater-opplysninger' passHref>
                    <Button as='a' variant={'secondary'}>
                        Legg til opplysninger
                    </Button>
                </Link>
            </div>
        </Box>
    );
}

function Opplysninger(props: OpplysningerProps) {
    if (!props.opplysninger) {
        return <ManglerOpplysninger {...props} />;
    }
    const { opplysninger, sisteArbeidssoekerperiodeId, egenvurderinger } = props;
    const mappedeOpplysninger = mapOpplysningerV2(opplysninger);
    const egenvurdering = egenvurderinger?.profilertTil;

    return (
        <Box className={'mb-4'}>
            <Heading level={'3'} size={'small'}>
                Opplysninger
            </Heading>
            <div className={'flex place-content-between mb-2'}>
                <BodyShort textColor={'subtle'}>
                    Oppdatert {prettyPrintDato(props.opplysninger.sendtInnAv.tidspunkt)} av{' '}
                    {mapUtfoertAvType(props.opplysninger.sendtInnAv.utfoertAv.type)}
                </BodyShort>
                <Valgmeny sisteArbeidssoekerperiodeId={sisteArbeidssoekerperiodeId} />
            </div>

            <Box borderWidth={'1'} padding={'space-16'}>
                <HGrid columns={2}>
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
