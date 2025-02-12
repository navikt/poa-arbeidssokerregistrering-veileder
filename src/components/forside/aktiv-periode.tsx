import { SamletInformasjon } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyShort, Box, Heading } from '@navikt/ds-react';
import { prettyPrintDato } from '../../lib/date-utils';
import { CheckmarkCircleIcon } from '@navikt/aksel-icons';

interface Props {
    samletInformasjon: SamletInformasjon;
}

function AktivPeriode(props: Props) {
    const { samletInformasjon } = props;
    const harTilgjengeligBekreftelse = samletInformasjon.bekreftelser.length > 0;
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
            <Box>
                <Heading level="3" size="small">
                    Bekreftelse
                </Heading>
                {!harTilgjengeligBekreftelse && (
                    <div className={'flex'}>
                        <CheckmarkCircleIcon title="a11y-title" fontSize="1.5rem" className={'mr-4'} />
                        Ingen ubekreftede arbeidssøkerperiode
                    </div>
                )}
            </Box>
        </>
    );
}

export default AktivPeriode;
