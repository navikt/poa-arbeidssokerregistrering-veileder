import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import { MerSykmeldtoppfolgingState } from '../model/mer-sykmeldtoppfolging';
import { SporsmalId } from '../model/sporsmal';

interface SykmeldtoppfolgingContextType {
    registrering: MerSykmeldtoppfolgingState;
    isValid: boolean;
    doValidate: boolean;
    setRegistrering: (data: any) => void;
    setDoValidate: (data: boolean) => void;
}

const pakrevdeSvarUnntattStilling = [
    SporsmalId.fremtidigSituasjon,
    SporsmalId.tilbakeIArbeid,
    SporsmalId.helseHinder,
    SporsmalId.utdanningBestatt,
    SporsmalId.utdanningGodkjent,
    SporsmalId.utdanning,
];

const muligeStillingsSvar = [SporsmalId.sisteJobb, SporsmalId.sisteStilling];

const SykmeldtoppfolgingContext = createContext<SykmeldtoppfolgingContextType>({
    registrering: {} as MerSykmeldtoppfolgingState,
    isValid: true,
    doValidate: false,
    setRegistrering: () => {},
    setDoValidate: () => false,
});

function SykmeldtoppfolgingProvider({ children }: { children: ReactNode }) {
    const [registrering, setRegistrering] = useState({} as MerSykmeldtoppfolgingState);
    const [isValid, setIsValid] = useState(true);
    const [doValidate, setDoValidate] = useState(false);

    const contextValue = {
        registrering,
        isValid,
        doValidate,
        setDoValidate,
        setRegistrering: (data) => setRegistrering({ ...registrering, ...data }),
    };

    useEffect(() => {
        const altOkUnntattStilling = isEqual(
            Object.keys(registrering)
                .filter((key) => pakrevdeSvarUnntattStilling.includes(key as SporsmalId))
                .sort(),
            pakrevdeSvarUnntattStilling.sort(),
        );
        const stillingOK =
            Object.keys(registrering).filter((key) => muligeStillingsSvar.includes(key as SporsmalId)).length > 0;
        const altOK = altOkUnntattStilling && stillingOK;
        setIsValid(altOK);
    }, [registrering]);

    return <SykmeldtoppfolgingContext.Provider value={contextValue}>{children}</SykmeldtoppfolgingContext.Provider>;
}

function useSykmeldtoppfolging() {
    const context = useContext(SykmeldtoppfolgingContext);

    if (context === undefined) {
        throw new Error('useSykmeldtoppfolgingContext må brukes under en SykmeldtoppfolgingProvider');
    }

    return context;
}

export { SykmeldtoppfolgingProvider, useSykmeldtoppfolging };
