import { Box, Heading, List, Button } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { useParamsFromContext } from '../contexts/params-from-context';

import KanRegistreresSomArbeidssoeker from './kan-registreres-som-arbeidssoeker';
import StartPeriodeKnapp from './start-periode-knapp';

function Arbeidssoekerstatus() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { fnr } = params;

    if (!fnr) return null;

    return (
        <Box className="flex flex-col items-center p-8">
            <Heading level="1" size="large" className="mb-8 text-center">
                Arbeidssøkerregistrering
            </Heading>
            <KanRegistreresSomArbeidssoeker />
            <div className="flex flex-row justify-between">
                <div>
                    <List as="ul" title="Velg arbeidssøkerregistrering hvis">
                        <List.Item>Personen skal være arbeidssøker fra i dag</List.Item>
                        <List.Item>Personen skal ha oppfølgingsvedtak 14a</List.Item>
                        <List.Item>Personen skal stå tilmeldt i arbeidssøkerregisteret</List.Item>
                    </List>
                    <StartPeriodeKnapp />
                </div>
            </div>
        </Box>
    );
}

export default Arbeidssoekerstatus;
