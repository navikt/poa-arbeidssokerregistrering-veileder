'use client';

import { BodyShort, Box, Button, Heading, Link, List, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';
import { TrackPageView } from '@/components/TrackPageView';
import { TilbakeTilForside } from '@/components/tilbake-til-forside';

// biome-ignore lint/suspicious/noShadowRestrictedNames: <Dette er nextJS spesifikt>
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <>
            <TrackPageView data={{ viser: 'generell feilmelding' }} />
            <TilbakeTilForside sidenavn={'Feil i systemet'} />
            <Box paddingBlock='space-80 space-32'>
                <VStack gap='space-48' align='start'>
                    <VStack gap='space-16'>
                        <Heading level='1' size='large'>
                            Beklager, noe gikk galt.
                        </Heading>
                        <BodyShort>
                            En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du
                            gjorde.
                        </BodyShort>
                        <BodyShort>Du kan prøve å</BodyShort>
                        <List>
                            <List.Item>
                                vente noen minutter og{' '}
                                <Link href='#' onClick={() => location.reload()}>
                                    laste siden på nytt
                                </Link>
                            </List.Item>
                            <List.Item>
                                <Link href='#' onClick={() => history.back()}>
                                    gå tilbake til forrige side
                                </Link>
                            </List.Item>
                        </List>
                        <BodyShort>
                            Hvis problemet vedvarer, kan du{' '}
                            <Link href='https://www.nav.no/kontaktoss' target='_blank'>
                                kontakte oss (åpnes i ny fane)
                            </Link>
                            .
                        </BodyShort>
                    </VStack>

                    {error?.digest && (
                        <BodyShort size='small' textColor='subtle'>
                            Feil-id: {error.digest}
                        </BodyShort>
                    )}

                    <Button variant='secondary' onClick={() => reset()}>
                        Prøv igjen
                    </Button>
                </VStack>
            </Box>
        </>
    );
}
