import { BodyLong, Box, Button, Heading } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { formaterDato } from '../lib/date-utils';
import { TilgjengeligeBekreftelser } from '../types/bekreftelse';
import useApiKall from '../hooks/useApiKall';

function BekreftelseInformasjon(props: { fnr: string; brukerMock: boolean }) {
    const { fnr, brukerMock } = props;
    const { data: tilgjengeligeBekreftelser, isLoading } = useApiKall<TilgjengeligeBekreftelser>(
        `/api/${brukerMock ? 'mocks/' : ''}tilgjengelige-bekreftelser`,
        'POST',
        fnr ? JSON.stringify({ identitetsnummer: fnr }) : null,
    );

    const router = useRouter();

    return (
        <Box>
            <Heading level="1" size="small">
                Bekreftelse
            </Heading>
            {tilgjengeligeBekreftelser && (
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
                    <Button variant={'secondary-neutral'} onClick={() => router.push('/bekreftelse')}>
                        Bekreft arbeidssøkerperiode
                    </Button>
                </>
            )}
            {!tilgjengeligeBekreftelser && <BodyLong>Ingen ubekreftede perioder.</BodyLong>}
        </Box>
    );
}

export default BekreftelseInformasjon;
