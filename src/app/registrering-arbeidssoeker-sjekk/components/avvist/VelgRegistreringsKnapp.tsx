'use client';

import { Box, Button, Checkbox } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Registreringsknapp med overstyring (bekreftelse via checkbox).
 *
 * Vises kun når `RegistreringSjekk` har bestemt at alle regler kan overstyres
 * (`klassifisering.kanAlleReglerOverstyres`) og ansatt har tilgang.
 *
 * Ren presentasjonskomponent uten props — all synlighetslogikk styres av parent.
 */
function VelgRegistreringsKnapp() {
    const router = useRouter();
    const [bekreftet, setBekreftet] = useState(false);

    return (
        <Box>
            <Checkbox checked={bekreftet} onChange={() => setBekreftet((x) => !x)} className='mb-4'>
                Jeg bekrefter at de nødvendige vurderingene er gjort og dokumentert
            </Checkbox>
            <Button
                variant='secondary-neutral'
                disabled={!bekreftet}
                onClick={() => router.push('/registrering-arbeidssoker?erForhaandsgodkjent=ja')}
            >
                Registrer som arbeidssøker
            </Button>
        </Box>
    );
}

export default VelgRegistreringsKnapp;
