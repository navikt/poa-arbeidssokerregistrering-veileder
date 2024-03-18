import { Heading, List, Button } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { useParamsFromContext } from '../contexts/params-from-context';

function VelgRegistreringstype() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { fnr } = params;

    if (!fnr) return null;

    return (
        <>
            <Heading level="1" size="large" className="mb-8 text-center">
                Velg hvordan personen skal registreres
            </Heading>
            <div className="flex flex-row justify-between">
                <div>
                    <List as="ul" title="Velg arbeidssøkerregistrering hvis">
                        <List.Item>Personen skal være arbeidssøker fra i dag</List.Item>
                        <List.Item>Personen skal ha oppfølgingsvedtak 14a</List.Item>
                        <List.Item>Personen skal stå tilmeldt i arbeidssøkerregisteret</List.Item>
                    </List>
                    <Button
                        variant="secondary-neutral"
                        onClick={() => router.push('/kan-registreres-som-arbeidssoeker')}
                    >
                        Start arbeidssøkerregistrering
                    </Button>
                </div>
                <div>
                    <List as="ul" title="Velg sykmeldtregistrering hvis">
                        <List.Item>Personen har arbeidsgiver og en aktiv sykemelding</List.Item>
                        <List.Item>Personen skal ha oppfølging etter at sykefraværet er over</List.Item>
                        <List.Item>Personen er ikke arbeidssøker</List.Item>
                    </List>
                    <Button
                        variant="secondary-neutral"
                        onClick={() => router.push('/kan-registreres-for-sykmeldtoppfoelging')}
                    >
                        Start sykmeldtregistrering
                    </Button>
                </div>
            </div>
        </>
    );
}

export default VelgRegistreringstype;
