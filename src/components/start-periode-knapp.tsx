import { Button, Box, ConfirmationPanel } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

function StartPeriodeKnapp() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';

    const [bekreftet, setBekreftet] = useState(false);

    if (!fnr) return null;

    return (
        <Box>
            <ConfirmationPanel
                checked={bekreftet}
                label="Jeg bekrefter at registreringen gjøres etter samtykke fra den som registreres"
                onChange={() => setBekreftet((x) => !x)}
                className="mb-4"
            />
            <Button
                variant="secondary-neutral"
                disabled={!bekreftet}
                onClick={() => router.push('/registrering-arbeidssoker')}
            >
                Registrer som arbeidssøker
            </Button>
        </Box>
    );
}

export default StartPeriodeKnapp;
