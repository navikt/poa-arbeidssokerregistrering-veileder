import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';
import { useParamsFromContext } from '../../contexts/params-from-context';

import { fetcher as api } from '../../lib/api-utils';
import { loggFlyt } from '../../lib/amplitude';
import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { hentRegistreringFeiletUrl } from '../../lib/hent-registrering-feilet-url';
import { FullforRegistreringResponse } from '../../model/registrering';
import { OppgaveRegistreringstype } from '../../model/feilsituasjonTyper';
import byggRegistrerArbeidssokerPayload from '../../lib/bygg-registrer-arbeidssoker-payload';

const TEKSTER: Tekster<string> = {
    nb: {
        registrer: 'Registrer arbeidssøker',
        advarsel: 'Alle spørsmålene i skjemaet må fylles ut før du kan registrere arbeidssøkeren.',
    },
    en: {
        registrer: 'Register Job Seeker',
    },
};

export const RegistrerArbeidssokerKnapp = () => {
    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(false);
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { setDoValidate, doValidate, isValid, registrering } = useRegistrering();
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;

    async function registrerArbeidssoker() {
        setIsDisabled(true);
        setDoValidate(true);
        if (isValid) {
            setDoValidate(false);
            setIsDisabled(true);
            const body = byggRegistrerArbeidssokerPayload(registrering);
            const registreringUrl = `/api/fullforregistrering?fnr=${fnr}&enhetId=${enhetId}`;
            loggFlyt({ hendelse: 'Sender inn skjema for registrering av arbeidssøker' });
            try {
                const response: FullforRegistreringResponse = await api(registreringUrl, {
                    method: 'post',
                    body: JSON.stringify(body),
                });
                const feiltype = response.type;

                if (feiltype) {
                    loggFlyt({ hendelse: 'Får ikke fullført registreringen av arbeidssøker', aarsak: feiltype });
                    return router.push(hentRegistreringFeiletUrl(feiltype, OppgaveRegistreringstype.REGISTRERING));
                }

                loggFlyt({ hendelse: 'Registrering av arbeidssøker fullført' });
                return router.push('/kvittering-arbeidssoker');
            } catch (e) {
                loggFlyt({
                    hendelse: 'Får ikke fullført registreringen av arbeidssøker',
                    aarsak: 'TEKNISK_FEIL' as any,
                });
                return router.push('/feil');
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
            <Button variant="primary" onClick={() => registrerArbeidssoker()} disabled={isDisabled}>
                {tekst('registrer')}
            </Button>
        </div>
    );
};
