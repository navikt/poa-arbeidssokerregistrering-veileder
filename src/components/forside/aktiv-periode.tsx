import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';
import useApiKall from '../../hooks/useApiKall';
import Opplysninger from './opplysninger';
import HistorikkLenke from './historikk-lenke';
import Bekreftelse from './bekreftelse';
import { mapUtfoertAvType } from './mapUtfoertAvType';
import { AggregertPeriode, TilgjengeligeBekreftelser } from '@navikt/arbeidssokerregisteret-utils';

interface Props {
    aggregertPeriode: AggregertPeriode;
    brukerMock: boolean;
    fnr: string;
}

function AktivPeriode(props: Props) {
    const { aggregertPeriode, brukerMock, fnr } = props;
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
                    Registrert {prettyPrintDatoOgKlokkeslett(aggregertPeriode.startet.tidspunkt)} av{' '}
                    {mapUtfoertAvType(aggregertPeriode.startet.utfoertAv.type)}
                </BodyShort>
            </Alert>
            <Opplysninger
                opplysninger={aggregertPeriode.opplysningerOmArbeidssoeker[0]}
                sisteArbeidssoekerperiodeId={aggregertPeriode.periodeId}
            />
            <Bekreftelse antallTilgjengeligBekreftelser={tilgjengeligeBekreftelser?.length} />
            <HistorikkLenke />
        </>
    );
}

export default AktivPeriode;
