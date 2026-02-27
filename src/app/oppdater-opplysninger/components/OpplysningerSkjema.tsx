'use client';

import { Alert, Button, HStack } from '@navikt/ds-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DinSituasjon } from '@/app/components/skjema/DinSituasjon';
import { Hindringer } from '@/app/components/skjema/Hindringer';
import { SisteJobb } from '@/app/components/skjema/SisteJobb';
import { Utdanning } from '@/app/components/skjema/Utdanning';
import { registrerOpplysninger } from '@/app/lib/api/inngang-opplysninger';
import { loggFlyt } from '@/lib/tracking';
import type { RegistreringState } from '@/model/registrering';
import { validateRegistrering } from './valider-registrering';

type OpplysningerSkjemaProps = {
    initState: RegistreringState;
    fnr?: string;
};

function OpplysningerSkjema({ initState, fnr }: OpplysningerSkjemaProps) {
    const router = useRouter();
    const [registrering, setRegistreringRaw] = useState<RegistreringState>(initState);
    const [doValidate, setDoValidate] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setRegistrering = (data: Partial<RegistreringState>) => {
        setRegistreringRaw((prevState) => ({ ...prevState, ...data }));
    };

    const isValid = useMemo(() => validateRegistrering(registrering), [registrering]);

    useEffect(() => {
        loggFlyt({ hendelse: 'Starter reaktivering av arbeidssøker' });
    }, []);

    const handleOppdaterOpplysninger = async () => {
        setDoValidate(true);
        setError(null);

        if (!isValid) {
            return;
        }

        setIsPending(true);
        loggFlyt({ hendelse: 'Sender inn skjema for registrering av arbeidssøker' });
        try {
            const result = await registrerOpplysninger(fnr, registrering);
            if (result.ok) {
                loggFlyt({ hendelse: 'Opplysninger oppdatert' });
                router.push('/kvittering-oppdatert-opplysninger');
            } else {
                loggFlyt({ hendelse: 'Får ikke oppdatert opplysninger' });
                const { error } = result as { ok: false; error: string };
                setError(error);
            }
        } catch (_e) {
            setError('Noe gikk galt ved oppdatering av opplysninger. Prøv igjen senere.');
        } finally {
            setIsPending(false);
        }
    };

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
            <HStack style={{ justifyContent: 'space-between' }}>
                <Link href='/' passHref>
                    <Button variant={'secondary'}>Avbryt</Button>
                </Link>
                <Button variant='primary' onClick={handleOppdaterOpplysninger} disabled={isPending} loading={isPending}>
                    Oppdater
                </Button>
            </HStack>
        </div>
    );
}
export { OpplysningerSkjema };
