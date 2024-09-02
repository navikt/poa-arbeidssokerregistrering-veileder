import { Button, Box, ConfirmationPanel } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useParamsFromContext } from '../contexts/params-from-context';

function OverstyrStartPeriodeKnapp() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { fnr } = params;
    const [bekreftet, setBekreftet] = useState(false);

    if (!fnr) return null;

    return (
        <Box>
            <ConfirmationPanel
                checked={bekreftet}
                label="Jeg bekrefter at de nødvendige vurderingene er gjort og dokumentert"
                onChange={() => setBekreftet((x) => !x)}
                className="mb-4"
            />
            <Button
                variant="secondary-neutral"
                disabled={!bekreftet}
                onClick={() => router.push('/registrering-arbeidssoker?erForhaandsgodkjent=ja')}
            >
                Registrer som arbeidssøker
            </Button>
        </Box>
    );
}

export default OverstyrStartPeriodeKnapp;
