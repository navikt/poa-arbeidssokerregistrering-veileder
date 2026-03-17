import { Alert, Button, Heading } from '@navikt/ds-react';
import Link from 'next/link';

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
    if (!vilFortsetteSomArbeidssoeker) {
        return (
            <>
                <Alert variant='warning' className='mb-4'>
                    <Heading size='xsmall'>Bruker er ikke lenger registrert som arbeidssøker</Heading>
                </Alert>
                <Link href='/'>Gå tilbake til forsiden</Link>
            </>
        );
    }

    if (harFlereBekreftelser) {
        return (
            <>
                <Alert variant='success' className='mb-4'>
                    <Heading size='xsmall'>Bekreftelsen er registrert</Heading>
                </Alert>
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
            <Alert variant='success' className='mb-4'>
                <Heading size='xsmall'>Bekreftelsen er registrert</Heading>
            </Alert>
            <Link href='/'>Gå tilbake til forsiden</Link>
        </>
    );
}

export { BekreftelseKvittering };
