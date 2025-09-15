import { Box, Button, Checkbox } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useParamsFromContext } from '../contexts/params-from-context';

function StartPeriodeKnapp() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { fnr } = params;

    const [bekreftet, setBekreftet] = useState(false);

    if (!fnr) return null;

    return (
        <Box>
            <Checkbox checked={bekreftet} onChange={() => setBekreftet((x) => !x)} className="mb-4">
                Jeg bekrefter at registreringen gjøres etter samtykke fra den som registreres
            </Checkbox>
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
