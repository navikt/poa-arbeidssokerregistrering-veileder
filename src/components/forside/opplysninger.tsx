import {
    lagHentTekstForSprak,
    OpplysningerMedProfilering,
    SPORSMAL_TEKSTER,
    Svar,
} from '@navikt/arbeidssokerregisteret-utils';
import { BodyShort, Box, Button, Heading, HGrid } from '@navikt/ds-react';
import { mapOpplysninger } from '../opplysninger-om-arbeidssoker-komponent';
import { prettyPrintDato } from '../../lib/date-utils';
import { useRouter } from 'next/router';
import { mapUtfoertAvType } from './mapUtfoertAvType';

import Valgmeny from './valgmeny';

interface Props {
    opplysninger: OpplysningerMedProfilering;
    sisteArbeidssoekerperiodeId: string;
}

type OpplysningProps = { sporsmal: string; svar: Svar | string };

function ManglerOpplysninger(props: Props) {
    const router = useRouter();
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
                <Button variant={'secondary'} onClick={() => router.push('/oppdater-opplysninger')}>
                    Legg til opplysninger
                </Button>
            </div>
        </Box>
    );
}

function Opplysninger(props: Props) {
    if (!props.opplysninger) {
        return <ManglerOpplysninger {...props} />;
    }
    const { opplysninger, sisteArbeidssoekerperiodeId } = props;
    const mappedeOpplysninger = mapOpplysninger(opplysninger);
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');
    const egenvurderinger = opplysninger.profilering?.egenvurderinger;
    const egenvurdering = egenvurderinger && egenvurderinger[0];

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
                    {mapUtfoertAvType(props.opplysninger.sendtInnAv.utfoertAv.type)}
                </BodyShort>
                <Valgmeny sisteArbeidssoekerperiodeId={sisteArbeidssoekerperiodeId} />
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
                        {egenvurdering && (
                            // eslint-disable-next-line react-hooks/static-components
                            <Opplysning
                                sporsmal={'egenvurdering'}
                                svar={`egenvurdering-${egenvurdering.egenvurdering}`}
                            />
                        )}
                    </div>
                </HGrid>
            </Box>
        </Box>
    );
}

export default Opplysninger;
