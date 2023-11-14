import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import { MerSykmeldtoppfolgingState } from '../model/mer-sykmeldtoppfolging';
import { SporsmalId, FremtidigSituasjon } from '../model/sporsmal';

interface SykmeldtoppfolgingContextType {
    registrering: MerSykmeldtoppfolgingState;
    isValid: boolean;
    doValidate: boolean;
    setRegistrering: (data: any) => void;
    setDoValidate: (data: boolean) => void;
}

function genererPakrevdeSvar(svar: FremtidigSituasjon) {
    let pakrevdeSvar = [SporsmalId.fremtidigSituasjon];
    if ([FremtidigSituasjon.NY_ARBEIDSGIVER, FremtidigSituasjon.USIKKER].includes(svar)) {
        pakrevdeSvar.push(
            ...[
                SporsmalId.andreForhold,
                SporsmalId.utdanning,
                SporsmalId.utdanningBestatt,
                SporsmalId.utdanningGodkjent,
            ],
        );
    }
    if ([FremtidigSituasjon.SAMME_ARBEIDSGIVER, FremtidigSituasjon.SAMME_ARBEIDSGIVER_NY_STILLING].includes(svar)) {
        pakrevdeSvar.push(SporsmalId.tilbakeIArbeid);
    }
    return pakrevdeSvar;
}

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
        const pakrevdeSvar = genererPakrevdeSvar(registrering?.fremtidigSituasjon);
        const altOk = isEqual(
            Object.keys(registrering)
                .filter((key) => pakrevdeSvar.includes(key as SporsmalId))
                .sort(),
            pakrevdeSvar.sort(),
        );
        setIsValid(altOk);
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
