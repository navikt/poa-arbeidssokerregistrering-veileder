import { BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import { CheckmarkCircleIcon, TimerStartIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';

import { loggAktivitet } from '../../lib/amplitude';

interface Props {
    antallTilgjengeligBekreftelser?: number;
}

function Bekreftelse(props: Props) {
    const { antallTilgjengeligBekreftelser } = props;
    const harTilgjengeligBekreftelse = antallTilgjengeligBekreftelser > 0;
    const router = useRouter();

    if (!harTilgjengeligBekreftelse) {
        // TEMP
        return null;
    }

    return (
        <Box className={'mb-4'}>
            <Heading level="3" size="small">
                Bekreftelse
            </Heading>
            {!harTilgjengeligBekreftelse && (
                <div className={'flex'}>
                    <CheckmarkCircleIcon title="a11y-title" fontSize="1.5rem" className={'mr-4'} />
                    <BodyShort textColor={'subtle'}>Ingen ubekreftede arbeidssøkerperioder</BodyShort>
                </div>
            )}
            {harTilgjengeligBekreftelse && (
                <>
                    <div className={'flex mb-4'}>
                        <TimerStartIcon title="a11y-title" fontSize="1.5rem" className={'mr-4'} />
                        <BodyShort textColor={'subtle'}>
                            {antallTilgjengeligBekreftelser === 1 && (
                                <>Personen har en ubekreftet arbeidssøkerperiode</>
                            )}
                            {antallTilgjengeligBekreftelser > 1 && (
                                <>Personen har {antallTilgjengeligBekreftelser} ubekreftede arbeidssøkerperioder</>
                            )}
                        </BodyShort>
                    </div>
                    <Button
                        variant={'secondary'}
                        onClick={() => {
                            loggAktivitet({ aktivitet: 'Går til bekreftelser' });
                            router.push('/bekreftelse');
                        }}
                    >
                        Bekreft arbeidssøkerperiode på vegne av bruker
                    </Button>
                </>
            )}
        </Box>
    );
}

export default Bekreftelse;
