import { SamletInformasjon } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { prettyPrintDato, prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';
import Bekreftelse from './bekreftelse';
import useApiKall from '../../hooks/useApiKall';
import { TilgjengeligeBekreftelser } from '../../types/bekreftelse';
import Opplysninger from './opplysninger';
import HistorikkLenke from './historikk-lenke';

interface Props {
    samletInformasjon: SamletInformasjon;
    brukerMock: boolean;
    fnr: string;
}

function AktivPeriode(props: Props) {
    const { samletInformasjon, brukerMock, fnr } = props;
    const { data: tilgjengeligeBekreftelser } = useApiKall<TilgjengeligeBekreftelser>(
        `/api/${brukerMock ? 'mocks/' : ''}tilgjengelige-bekreftelser`,
        'POST',
        JSON.stringify({ identitetsnummer: fnr }),
    );

    return (
        <>
            <Alert variant={'info'} className={'mb-4'}>
                <Heading level={'3'} size={'small'}>
                    Personen er registrert som arbeidssøker
                </Heading>
                <BodyShort textColor={'subtle'}>
                    Registrert{' '}
                    {prettyPrintDatoOgKlokkeslett(samletInformasjon.arbeidssoekerperioder[0].startet.tidspunkt)} av{' '}
                    {samletInformasjon.arbeidssoekerperioder[0].startet.utfoertAv.type}
                </BodyShort>
            </Alert>
            <Opplysninger
                opplysninger={samletInformasjon.opplysningerOmArbeidssoeker[0]}
                sisteArbeidssoekerperiodeId={samletInformasjon.arbeidssoekerperioder[0].periodeId}
            />
            <Bekreftelse antallTilgjengeligBekreftelser={tilgjengeligeBekreftelser?.length} />
            <HistorikkLenke />
        </>
    );
}

export default AktivPeriode;
