import { CheckmarkCircleIcon, TimerStartIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import Link from 'next/link';
import { loggAktivitet } from '@/lib/tracking';

interface BekreftelseProps {
    antallTilgjengeligBekreftelser?: number;
}

function Bekreftelse({ antallTilgjengeligBekreftelser }: BekreftelseProps) {
    if (!antallTilgjengeligBekreftelser) return null;
    const harTilgjengeligBekreftelse = antallTilgjengeligBekreftelser > 0;

    return (
        <Box className={'mb-4'}>
            <Heading level='3' size='small'>
                Bekreftelse
            </Heading>
            {!harTilgjengeligBekreftelse && (
                <div className={'flex'}>
                    <CheckmarkCircleIcon title='a11y-title' fontSize='1.5rem' className={'mr-4'} />
                    <BodyShort textColor={'subtle'}>Ingen ubekreftede arbeidssøkerperioder</BodyShort>
                </div>
            )}
            {harTilgjengeligBekreftelse && (
                <>
                    <div className={'flex mb-4'}>
                        <TimerStartIcon title='a11y-title' fontSize='1.5rem' className={'mr-4'} />
                        <BodyShort textColor={'subtle'}>
                            {antallTilgjengeligBekreftelser === 1 && (
                                <>Personen har en ubekreftet arbeidssøkerperiode</>
                            )}
                            {antallTilgjengeligBekreftelser > 1 && (
                                <>Personen har {antallTilgjengeligBekreftelser} ubekreftede arbeidssøkerperioder</>
                            )}
                        </BodyShort>
                    </div>
                    <Link href='/bekreftelse' passHref>
                        <Button
                            as='a'
                            variant={'secondary'}
                            onClick={() => loggAktivitet({ aktivitet: 'Går til bekreftelser' })}
                        >
                            Bekreft arbeidssøkerperiode på vegne av bruker
                        </Button>
                    </Link>
                </>
            )}
        </Box>
    );
}

export { Bekreftelse };
