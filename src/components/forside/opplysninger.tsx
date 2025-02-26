import {
    lagHentTekstForSprak,
    OpplysningerOmArbeidssoker,
    SPORSMAL_TEKSTER,
    Svar,
} from '@navikt/arbeidssokerregisteret-utils';
import { BodyShort, Box, Button, Heading, HGrid, Link } from '@navikt/ds-react';
import { mapOpplysninger } from '../opplysninger-om-arbeidssoker-komponent';
import { prettyPrintDato } from '../../lib/date-utils';
import { useRouter } from 'next/router';

interface Props {
    opplysninger: OpplysningerOmArbeidssoker;
    sisteArbeidssoekerperiodeId: string;
}

type OpplysningProps = { sporsmal: string; svar: Svar | string };

function ManglerOpplysninger() {
    const router = useRouter();
    return (
        <Box className={'mb-4'}>
            <Heading level={'3'} size={'small'}>
                Opplysninger
            </Heading>
            <BodyShort textColor={'subtle'}>Ingen opplysninger registrert</BodyShort>
            <div className={'mt-4'}>
                <Button variant={'secondary'} onClick={() => router.push('/oppdater-opplysninger')}>
                    Legg til opplysninger
                </Button>
            </div>
        </Box>
    );
}
function Opplysninger(props: Props) {
    if (!props.opplysninger) {
        return <ManglerOpplysninger />;
    }
    const { opplysninger, sisteArbeidssoekerperiodeId } = props;
    const mappedeOpplysninger = mapOpplysninger(opplysninger);
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');

    const Opplysning = (props: OpplysningProps) => {
        const { sporsmal, svar } = props;
        return (
            <div className={'mb-5'}>
                <BodyShort>
                    <strong>{tekst(sporsmal)}</strong>
                    <br />
                    {tekst(svar as string) ?? svar}
                </BodyShort>
            </div>
        );
    };
    return (
        <Box className={'mb-4'}>
            <Heading level={'3'} size={'small'}>
                Opplysninger
            </Heading>
            <div className={'flex place-content-between mb-2'}>
                <BodyShort textColor={'subtle'}>
                    Oppdatert {prettyPrintDato(props.opplysninger.sendtInnAv.tidspunkt)} av{' '}
                    {props.opplysninger.sendtInnAv.utfoertAv.type}
                </BodyShort>
                <Link href={`/oppdater-opplysninger?periodeId=${sisteArbeidssoekerperiodeId}`}>Endre opplysninger</Link>
            </div>
            <Box borderWidth={'1'} padding={'5'}>
                <HGrid columns={2}>
                    <div>
                        {mappedeOpplysninger.slice(0, Math.floor((mappedeOpplysninger.length + 1) / 2)).map((o) => {
                            return <Opplysning {...o} key={o.sporsmal} />;
                        })}
                    </div>
                    <div>
                        {mappedeOpplysninger.slice(Math.floor((mappedeOpplysninger.length + 1) / 2)).map((o) => {
                            return <Opplysning {...o} key={o.sporsmal} />;
                        })}
                    </div>
                </HGrid>
            </Box>
        </Box>
    );
}

export default Opplysninger;
