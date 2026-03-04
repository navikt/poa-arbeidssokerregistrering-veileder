'use client';

import { Alert, Box, Button } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useModiaContext } from '@/app/contexts/modia-context';
import { stoppPeriode } from '@/app/lib/api/inngang-stopp-periode';
import { loggAktivitet } from '@/lib/tracking';

function AvsluttPeriode() {
    const { fnr } = useModiaContext();
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<boolean | string>(false);

    const handleAvsluttArbeidssoekerperiode = async () => {
        setIsPending(true);
        setError(false);
        try {
            const result = await stoppPeriode(fnr);
            if (result.ok) {
                loggAktivitet({ aktivitet: 'Avslutter arbeidssøkerperiode' });
                router.push('/arbeidssoekerperiode-er-avsluttet');
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
            <Button variant='primary' disabled={isPending} onClick={handleAvsluttArbeidssoekerperiode}>
                Avslutt arbeidssøkerperioden
            </Button>
        </Box>
    );
}
export { AvsluttPeriode };
