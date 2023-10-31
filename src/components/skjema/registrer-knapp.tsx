import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';

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
    const [isDisabled, setIsDisabled] = useState(false)
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { setDoValidate, doValidate, isValid } = useRegistrering()

    function registrerArbeidssoker () {
      setIsDisabled(true)
      setDoValidate(true)
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
