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
        oppdater: 'Oppdater opplysninger til arbeidssøker',
        advarsel: 'Alle spørsmålene i skjemaet må være fylt ut før du kan oppdatere opplysningerne.',
    },
    en: {
        oppdater: 'Updated information of job seeker',
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

    async function oppdaterOpplysninger() {
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
                    loggFlyt({ hendelse: 'Får ikke oppdatert opplysninger' });
                    return router.push('/feil');
                } else {
                    loggFlyt({ hendelse: 'Opplysninger oppdatert' });
                    return router.push('/kvittering-oppdatert-opplysninger');
                }
            } catch (e) {
                loggFlyt({
                    hendelse: 'Får ikke oppdatert opplysninger',
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
            <Button variant="primary" onClick={() => oppdaterOpplysninger()} disabled={isDisabled} loading={isPending}>
                {tekst('oppdater')}
            </Button>
        </div>
    );
};
