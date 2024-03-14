import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';
import { useParamsFromContext } from '../../contexts/params-from-context';
import { useConfig } from '../../contexts/config-context';

import { loggFlyt } from '../../lib/amplitude';
import byggOpplysningerPayload from '../../lib/bygg-opplysninger-payload';
import { Config } from '../../model/config';

const TEKSTER: Tekster<string> = {
    nb: {
        registrer: 'Registrer arbeidssøker',
        advarsel: 'Alle spørsmålene i skjemaet må fylles ut før du kan registrere arbeidssøkeren.',
    },
    en: {
        registrer: 'Register Job Seeker',
    },
};

export const OppdaterOpplysningerKnapp = () => {
    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { setDoValidate, doValidate, isValid, registrering } = useRegistrering();
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';

    const opplysningerUrl = brukerMock ? '/api/mocks/opplysninger' : '/api/opplysninger';

    async function registrerArbeidssoker() {
        setIsDisabled(true);
        setDoValidate(true);
        if (isValid) {
            setDoValidate(false);
            setIsDisabled(true);
            setIsPending(true);
            const body = byggOpplysningerPayload(registrering);

            loggFlyt({ hendelse: 'Sender inn skjema for registrering av arbeidssøker' });
            try {
                const response = await fetch(opplysningerUrl, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ identitetsnummer: fnr, ...body }),
                    headers: {
                        'Content-type': 'application/json',
                    },
                });
                if (!response.ok) {
                    loggFlyt({ hendelse: 'Får ikke fullført registreringen av arbeidssøker' });
                    return router.push('/feil');
                } else {
                    loggFlyt({ hendelse: 'Registrering av arbeidssøker fullført' });
                    return router.push('/kvittering-arbeidssoker');
                }
            } catch (e) {
                loggFlyt({
                    hendelse: 'Får ikke fullført registreringen av arbeidssøker',
                    aarsak: 'TEKNISK_FEIL' as any,
                });
                return router.push('/feil');
            } finally {
                setIsPending(false);
            }
        }
    }

    useEffect(() => {
        if (doValidate && isValid) {
            setIsDisabled(false);
        }
    }, [doValidate, isValid]);

    return (
        <div className="flex justify-end">
            <Button variant="primary" onClick={() => registrerArbeidssoker()} disabled={isDisabled} loading={isPending}>
                {tekst('registrer')}
            </Button>
        </div>
    );
};
