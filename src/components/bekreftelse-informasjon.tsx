import { BodyLong, Box, Button, Heading } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { loggAktivitet } from '../lib/amplitude';
import { formaterDato } from '../lib/date-utils';
import useApiKall from '../hooks/useApiKall';
import { TilgjengeligeBekreftelser } from '@navikt/arbeidssokerregisteret-utils';

function BekreftelseInformasjon(props: { fnr: string; brukerMock: boolean }) {
    const { fnr, brukerMock } = props;
    const { data: tilgjengeligeBekreftelser, isLoading } = useApiKall<TilgjengeligeBekreftelser>(
        `/api/${brukerMock ? 'mocks/' : ''}tilgjengelige-bekreftelser`,
        'POST',
        fnr ? JSON.stringify({ identitetsnummer: fnr }) : null,
    );

    const router = useRouter();
    const harTilgjengeligBekreftelse = tilgjengeligeBekreftelser?.length > 0;
    return (
        <Box>
            <Heading level="1" size="small">
                Bekreftelse
            </Heading>
            {harTilgjengeligBekreftelse && (
                <>
                    <div>
                        Ubekreftet arbeidssøkerstatus for perioden:
                        <ul>
                            {tilgjengeligeBekreftelser.map((bekreftelse) => {
                                return (
                                    <li key={bekreftelse.bekreftelseId}>
                                        {formaterDato(bekreftelse.gjelderFra)} - {formaterDato(bekreftelse.gjelderTil)}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <Button
                        variant={'secondary-neutral'}
                        onClick={() => {
                            loggAktivitet({ aktivitet: 'Går til bekreftelser' });
                            router.push('/bekreftelse');
                        }}
                    >
                        Bekreft arbeidssøkerperiode
                    </Button>
                </>
            )}
            {!harTilgjengeligBekreftelse && <BodyLong>Ingen ubekreftede perioder.</BodyLong>}
        </Box>
    );
}

export default BekreftelseInformasjon;
