import { CheckmarkCircleIcon, TimerStartIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HStack } from '@navikt/ds-react';
import Link from 'next/link';
import { loggAktivitet } from '@/lib/tracking';

interface BekreftelseProps {
    antallTilgjengeligBekreftelser?: number;
}

function Bekreftelse({ antallTilgjengeligBekreftelser }: BekreftelseProps) {
    if (!antallTilgjengeligBekreftelser) return null;
    const harTilgjengeligBekreftelse = antallTilgjengeligBekreftelser > 0;

    return (
        <Box marginBlock='space-0 space-16'>
            <Heading level='3' size='small'>
                Bekreftelse
            </Heading>
            {!harTilgjengeligBekreftelse && (
                <HStack gap='space-16'>
                    <CheckmarkCircleIcon aria-hidden='true' fontSize='1.5rem' />
                    <BodyShort textColor={'subtle'}>Ingen ubekreftede arbeidssøkerperioder</BodyShort>
                </HStack>
            )}
            {harTilgjengeligBekreftelse && (
                <>
                    <HStack gap='space-16' marginBlock='space-0 space-16'>
                        <TimerStartIcon aria-hidden='true' fontSize='1.5rem' />
                        <BodyShort textColor={'subtle'}>
                            {antallTilgjengeligBekreftelser === 1 && (
                                <>Personen har en ubekreftet arbeidssøkerperiode</>
                            )}
                            {antallTilgjengeligBekreftelser > 1 && (
                                <>Personen har {antallTilgjengeligBekreftelser} ubekreftede arbeidssøkerperioder</>
                            )}
                        </BodyShort>
                    </HStack>
                    <Button
                        as={Link}
                        href='/bekreftelse'
                        role='link'
                        variant={'secondary'}
                        onClick={() => loggAktivitet({ aktivitet: 'Går til bekreftelser' })}
                    >
                        Bekreft arbeidssøkerperiode på vegne av bruker
                    </Button>
                </>
            )}
        </Box>
    );
}

export { Bekreftelse };
