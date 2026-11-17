'use client';

import { Alert, Box, Button, Heading } from '@navikt/ds-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

type BekreftelseKvitteringProps = {
    vilFortsetteSomArbeidssoeker: boolean;
    harFlereBekreftelser: boolean;
    onNesteBekreftelse: () => void;
};

function BekreftelseKvittering({
    vilFortsetteSomArbeidssoeker,
    harFlereBekreftelser,
    onNesteBekreftelse,
}: BekreftelseKvitteringProps) {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    if (!vilFortsetteSomArbeidssoeker) {
        return (
            <>
                <Box marginBlock='space-0 space-16'>
                    <Alert variant='warning'>
                        <Heading ref={headingRef} level='2' size='xsmall' tabIndex={-1}>
                            Bruker er ikke lenger registrert som arbeidssøker
                        </Heading>
                    </Alert>
                </Box>
                <Link href='/'>Gå tilbake til forsiden</Link>
            </>
        );
    }

    if (harFlereBekreftelser) {
        return (
            <>
                <Box marginBlock='space-0 space-16'>
                    <Alert variant='success'>
                        <Heading ref={headingRef} level='2' size='xsmall' tabIndex={-1}>
                            Bekreftelsen er registrert
                        </Heading>
                    </Alert>
                </Box>
                <div>
                    <Button variant='secondary' onClick={onNesteBekreftelse}>
                        Svar for neste periode
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Box marginBlock='space-0 space-16'>
                <Alert variant='success'>
                    <Heading ref={headingRef} level='2' size='xsmall' tabIndex={-1}>
                        Bekreftelsen er registrert
                    </Heading>
                </Alert>
            </Box>
            <Link href='/'>Gå tilbake til forsiden</Link>
        </>
    );
}

export { BekreftelseKvittering };
