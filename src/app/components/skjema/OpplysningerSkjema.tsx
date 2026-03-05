'use client';

import { Alert, Button, HStack } from '@navikt/ds-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DinSituasjon } from '@/app/components/skjema/DinSituasjon';
import { Hindringer } from '@/app/components/skjema/Hindringer';
import { SisteJobb } from '@/app/components/skjema/SisteJobb';
import { Utdanning } from '@/app/components/skjema/Utdanning';
import { useModiaContext } from '@/app/contexts/modia-context';
import { registrerOpplysninger } from '@/app/lib/api/inngang-opplysninger';
import { startPeriode } from '@/app/lib/api/inngang-start-periode';
import { GenereltOmSamtykke } from '@/app/registrering-arbeidssoker/components/GenereltOmSamtykke';
import { loggFlyt } from '@/lib/tracking';
import type { RegistreringState } from '@/model/registrering';
import { validateRegistrering } from './valider-registrering';

type OpplysningerSkjemaProps = {
    initState: RegistreringState;
    mode: 'registrering' | 'oppdater';
};

function OpplysningerSkjema({ initState, mode }: OpplysningerSkjemaProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { fnr } = useModiaContext();
    const [registrering, setRegistreringRaw] = useState<RegistreringState>(initState);
    const [doValidate, setDoValidate] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setRegistrering = (data: Partial<RegistreringState>) => {
        setRegistreringRaw((prevState) => ({ ...prevState, ...data }));
    };

    const isValid = useMemo(() => validateRegistrering(registrering), [registrering]);

    useEffect(() => {
        if (mode === 'oppdater') {
            loggFlyt({ hendelse: 'Starter reaktivering av arbeidssøker' });
        } else if (mode === 'registrering') {
            loggFlyt({ hendelse: 'Starter registrering av arbeidssøker' });
        }
    }, [mode]);

    const handleOnSkjemaSubmit = async () => {
        setDoValidate(true);
        setError(null);

        if (!isValid || !fnr) {
            return;
        }

        setIsPending(true);

        if (mode === 'registrering') {
            loggFlyt({ hendelse: 'Sender inn skjema for registrering av arbeidssøker' });
        }

        try {
            if (mode === 'oppdater') {
                const result = await registrerOpplysninger(fnr, registrering);
                if (result.ok) {
                    loggFlyt({ hendelse: 'Opplysninger oppdatert' });
                    router.push('/kvittering-oppdatert-opplysninger');
                } else {
                    loggFlyt({ hendelse: 'Får ikke oppdatert opplysninger' });
                    const { error } = result as { ok: false; error: string };
                    setError(error);
                    return;
                }
            } else if (mode === 'registrering') {
                const erForhaandsgodkjent = searchParams?.get('erForhaandsgodkjent') === 'ja';

                const [periodeRes, opplysningRes] = await Promise.allSettled([
                    startPeriode(fnr, erForhaandsgodkjent),
                    registrerOpplysninger(fnr, registrering),
                ]);

                const feil: string[] = [];

                // Håndterer start av periode feil
                if (periodeRes.status === 'rejected') {
                    feil.push('Klarte ikke å starte periode');
                } else if (!periodeRes.value.ok) {
                    const { error } = periodeRes.value as { ok: false; error: string };
                    feil.push(error);
                }

                // Håndterer opplysninger feil
                if (opplysningRes.status === 'rejected') {
                    feil.push('Klarte ikke å lagre opplysninger');
                } else if (!opplysningRes.value.ok) {
                    const { error } = opplysningRes.value as { ok: false; error: string };
                    feil.push(error);
                }

                if (feil.length > 0) {
                    loggFlyt({
                        hendelse: 'Får ikke oppdatert opplysninger',
                    });
                    setError(feil.join(', '));
                    return;
                }

                // TODO: tror det er egen type hendelse for feil ved registrering. Sjekk ut.
                loggFlyt({ hendelse: 'Opplysninger oppdatert' });
                loggFlyt({ hendelse: 'Registrering av arbeidssøker fullført' });
                router.push('/kvittering-arbeidssoker');
            }
        } catch (_e) {
            setError('Noe gikk galt ved oppdatering av opplysninger. Prøv igjen senere.');
        } finally {
            setIsPending(false);
        }
    };

    if (!fnr) return null;

    return (
        <div>
            <DinSituasjon registrering={registrering} setRegistrering={setRegistrering} doValidate={doValidate} />
            <SisteJobb registrering={registrering} setRegistrering={setRegistrering} doValidate={doValidate} />
            <Utdanning registrering={registrering} setRegistrering={setRegistrering} doValidate={doValidate} />
            <Hindringer registrering={registrering} setRegistrering={setRegistrering} doValidate={doValidate} />
            {error && (
                <Alert variant='error' className='mb-4'>
                    {error}
                </Alert>
            )}
            {mode === 'registrering' && <GenereltOmSamtykke />}
            <HStack style={{ justifyContent: 'space-between' }}>
                <Link href='/' passHref>
                    <Button variant={'secondary'}>Avbryt</Button>
                </Link>
                <Button variant='primary' onClick={handleOnSkjemaSubmit} disabled={isPending} loading={isPending}>
                    {mode === 'registrering' ? 'Registrer' : 'Oppdater'}
                </Button>
            </HStack>
        </div>
    );
}
export { OpplysningerSkjema };
