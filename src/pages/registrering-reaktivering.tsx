import { Alert, Button, Heading } from '@navikt/ds-react';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { useEffect, useState } from 'react';
import { useParamsFromContext } from '../contexts/params-from-context';
import { fetcher as api } from '../lib/api-utils';
import { logger } from '@navikt/next-logger';

export default function RegistreringReaktivering() {
    const { fnr, enhetId } = useParamsFromContext();
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<any>();
    const [success, setSuccess] = useState<boolean>(false);
    async function onReaktiverArbeidssoker() {
        try {
            setIsPending(true);
            await api(`/api/reaktivering?fnr=${fnr}`, {
                method: 'POST',
                body: JSON.stringify({}),
            });
            setSuccess(true);
        } catch (err: unknown) {
            console.error(err, 'Feil ved reaktivering');
            setError(err);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <section className="flex flex-col items-center p-8">
            <main className="flex flex-col max-w-4xl w-full" tabIndex={-1} id="maincontent">
                <Heading size="medium" level="1">
                    Reaktiver arbeidssøker
                </Heading>
                <Button loading={isPending} disabled={error || success} onClick={onReaktiverArbeidssoker}>
                    Reaktiver arbeidssoker
                </Button>
                {error && (
                    <Alert className={'mt-4'} variant={'error'}>
                        Noe gikk dessverre galt! {error.message}
                    </Alert>
                )}
                {success && (
                    <Alert className={'mt-4'} variant={'success'}>
                        Arbeidssøkeren ble reaktivert!
                    </Alert>
                )}
            </main>
        </section>
    );
}

export const getServerSideProps = withAuthenticatedPage();
