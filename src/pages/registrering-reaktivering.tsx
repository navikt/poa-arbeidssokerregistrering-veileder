import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { withAuthenticatedPage } from '../auth/withAuthentication';
import { fetcher as api } from '../lib/api-utils';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import { Config } from '../model/config';
import DemoPanel from '../components/demo-panel';
import { loggFlyt } from '../lib/amplitude';

export default function RegistreringReaktivering() {
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const router = useRouter();
    const { enableMock } = useConfig() as Config;
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<any>();
    const [success, setSuccess] = useState<boolean>(false);
    const brukerMock = enableMock === 'enabled';

    const visInnhold = fnr && enhetId;

    async function onReaktiverArbeidssoker() {
        try {
            setIsPending(true);
            await api(`/api/reaktivering?fnr=${fnr}`, {
                method: 'POST',
                body: JSON.stringify({}),
            });
            setSuccess(true);
            return router.push('/kvittering-reaktivering');
        } catch (err: unknown) {
            console.error(err, 'Feil ved reaktivering');
            setError(err);
        } finally {
            setIsPending(false);
        }
    }

    useEffect(() => {
        loggFlyt({ hendelse: 'Starter reaktivering av arbeidssøker' });
    }, []);

    return (
        <>
            <ManglerPersonEllerEnhet />
            {visInnhold && (
                <>
                    <Heading size="medium" level="1" className="mb-8">
                        Reaktiver arbeidssøker
                    </Heading>
                    <Alert variant="info" className="mb-8">
                        <Heading level="1" size="small">
                            Personen kan reaktiveres som arbeidssøker
                        </Heading>
                        <BodyShort>Personen har nylig vært registrert som arbeidssøker men har falt ut.</BodyShort>
                        <BodyShort>
                            Dersom vedkommende fortsatt skal være registrert som arbeidssøker kan du reaktivere hen.
                        </BodyShort>
                    </Alert>
                    <div className="flex justify-end">
                        <Button loading={isPending} disabled={error || success} onClick={onReaktiverArbeidssoker}>
                            Reaktiver arbeidssøker
                        </Button>
                    </div>
                    {error && (
                        <Alert className={'mt-4'} variant={'error'}>
                            Noe gikk dessverre galt! {error.message}
                        </Alert>
                    )}
                </>
            )}
            <DemoPanel brukerMock={brukerMock} />
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
