import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Alert, Heading, List, Loader } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';

import { RegistreringType } from '../model/registrering';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { loggFlyt } from '../lib/amplitude';

interface StartregistreringResponse {
    registreringType: RegistreringType;
}

function Feilmelding() {
    return (
        <Alert variant="warning">
            <Heading size="small" level="1" className="mb-8">
                Personen kan ikke registreres for mer sykmeldtoppfølging
            </Heading>
            <List as="ul" description="Sjekk at følgende er registrert i systemene:">
                <List.Item>Personen har arbeidsgiver</List.Item>
                <List.Item>Personen har aktiv sykemelding</List.Item>
            </List>
        </Alert>
    );
}

function HenterDataLoader() {
    return (
        <div className="flex justify-center">
            <Loader size="3xlarge" title="Henter data..." />
        </div>
    );
}

export default function KanRegistreresForSykmeldtoppfoelging() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const [registreringsData, setRegistreringsData] = useState<StartregistreringResponse>();
    const [error, setError] = useState<any>();
    const [kanIkkeRegistreresForSykmeldtoppfoelging, setKanIkkeRegistreresForSykmeldtoppfoelging] =
        useState<boolean>(false);

    async function apiKall() {
        try {
            const response = await fetch(`/api/startregistrering?fnr=${fnr}`);
            if (response.ok) {
                const data = await response.json();
                setRegistreringsData(data);
            } else {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(response.statusText);
            }
        } catch (err: unknown) {
            setError(err);
        }
    }

    useEffect(() => {
        if (fnr && enhetId) {
            apiKall();
        }
    }, [fnr, enhetId]);

    useEffect(() => {
        if (registreringsData) {
            if (registreringsData.registreringType === RegistreringType.SYKMELDT_REGISTRERING) {
                router.push('/registrering-mer-sykmeldtoppfolging');
            } else {
                setKanIkkeRegistreresForSykmeldtoppfoelging(true);
            }
        }
    }, [enhetId, fnr, registreringsData, router]);

    useEffect(() => {
        if (error) {
            loggFlyt({ hendelse: 'Kan ikke registreres for mer sykmeldtoppfølging' });
            router.push('/feil/');
        }
    }, [error, router]);

    return <>{kanIkkeRegistreresForSykmeldtoppfoelging ? <Feilmelding /> : <HenterDataLoader />}</>;
}

export const getServerSideProps = withAuthenticatedPage();
