import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import { fetcher as api } from '../../lib/api-utils';
import { loggFlyt } from '../../lib/amplitude';
import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { hentRegistreringFeiletUrl } from '../../lib/hent-registrering-feilet-url';
import { FullforRegistreringResponse } from '../../model/registrering';
import { OppgaveRegistreringstype } from '../../model/feilsituasjonTyper';

const TEKSTER: Tekster<string> = {
    nb: {
        registrer: 'Registrer arbeidssøker',
        advarsel: 'Alle spørsmålene i skjemaet må fylles ut før du kan registrere arbeidssøkeren.',
    },
    en: {
        registrer: 'Register Job Seeker',
    },
};

export const RegistrerKnapp = () => {
    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(false)
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { setDoValidate, doValidate, isValid, registrering } = useRegistrering()

    async function registrerArbeidssoker () {
      setIsDisabled(true)
      setDoValidate(true)
      if (isValid) {
        const body = registrering
        const response: FullforRegistreringResponse = await api(
          '/api/fullforregistrering/',
          {
              method: 'post',
              body: JSON.stringify(body),
          },
        );
        const feiltype = response.type;

        if (feiltype) {
          loggFlyt({ hendelse: 'Får ikke fullført registreringen', aarsak: feiltype });
          return router.push(hentRegistreringFeiletUrl(feiltype, OppgaveRegistreringstype.REGISTRERING));
        }

        return router.push('/kvittering')
      }
    }

    useEffect(() => {
      if (doValidate && isValid) {
        setIsDisabled(false)
      }
    }, [doValidate, isValid])

    return (
        <div className='flex justify-end'>
            <Button
              variant="primary"
              onClick={() => registrerArbeidssoker()}
              disabled={isDisabled}
            >
              {tekst('registrer')}
            </Button>
        </div>
    );
};
