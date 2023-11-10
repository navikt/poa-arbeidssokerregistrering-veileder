import { useState } from 'react';
import { Alert, Button, Heading } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { withAuthenticatedPage } from '../auth/withAuthentication';
import { fetcher as api } from '../lib/api-utils';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import { Config } from '../model/config';
import DemoPanel from '../components/demo-panel';

export default function RegistreringReaktivering() {
    const { fnr, enhetId } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<any>();
    const [success, setSuccess] = useState<boolean>(false);
    const brukerMock = enableMock === 'enabled';

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
                <ManglerPersonEllerEnhet />
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
            <DemoPanel brukerMock={brukerMock} />
        </section>
    );
}

export const getServerSideProps = withAuthenticatedPage();
