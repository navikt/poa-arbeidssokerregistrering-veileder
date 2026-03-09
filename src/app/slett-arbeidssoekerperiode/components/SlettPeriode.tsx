'use client';

import { Alert, Box, Button } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BekreftValgPanel } from '@/components/bekreft-valg-panel';
import { useModiaContext } from '@/contexts/modia-context';
import { slettPeriode } from '@/lib/api/inngang-slett-periode';

function SlettPeriode() {
    const { fnr } = useModiaContext();
    const router = useRouter();
    const [bekreftet, setBekreftet] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<boolean | string>(false);

    const handleSlettArbeidssoekerperiode = async () => {
        setIsPending(true);
        setError(false);
        try {
            const result = await slettPeriode(fnr);
            if (result.ok) {
                router.push('/arbeidssoekerperiode-er-slettet');
            } else {
                setError('Noe gikk galt. Prøv igjen senere.');
            }
        } catch (_e) {
            // TODO: den gamle redirected til /feil -
            // Må ta stilling om dette er noe vi skal ha med videre
            // router.push('/feil');
            setError('Noe gikk galt. Prøv igjen senere.');
        } finally {
            setIsPending(false);
        }
    };

    if (!fnr) return null;

    return (
        <Box>
            {error && <Alert variant='error'>{error}</Alert>}
            <BekreftValgPanel
                checked={bekreftet}
                label='Jeg bekrefter at arbeidssøkerperioden skal slettes på grunn av feilregistrering'
                onChange={() => setBekreftet((x) => !x)}
                className='ml-4'
            />
            <Button
                variant='danger'
                disabled={!bekreftet || isPending}
                onClick={() => handleSlettArbeidssoekerperiode()}
            >
                Slett arbeidssøkerperioden
            </Button>
        </Box>
    );
}
export { SlettPeriode };
