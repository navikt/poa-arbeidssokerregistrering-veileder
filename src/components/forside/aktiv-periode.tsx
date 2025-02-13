import { SamletInformasjon } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { prettyPrintDato } from '../../lib/date-utils';
import Bekreftelse from './bekreftelse';
import useApiKall from '../../hooks/useApiKall';
import { TilgjengeligeBekreftelser } from '../../types/bekreftelse';
import Opplysninger from './opplysninger';

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

    const harTilgjengeligBekreftelse = tilgjengeligeBekreftelser?.length > 0;

    return (
        <>
            <Alert variant={'info'} className={'mb-4'}>
                <Heading level={'3'} size={'small'}>
                    Personen er registrert som arbeidssøker
                </Heading>
                <BodyShort textColor={'subtle'}>
                    Registrert {prettyPrintDato(samletInformasjon.arbeidssoekerperioder[0].startet.tidspunkt)}
                </BodyShort>
            </Alert>
            <Opplysninger opplysninger={samletInformasjon.opplysningerOmArbeidssoeker[0]} />
            <Bekreftelse harTilgjengeligBekreftelse={harTilgjengeligBekreftelse} />
        </>
    );
}

export default AktivPeriode;
