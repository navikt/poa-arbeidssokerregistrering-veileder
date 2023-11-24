import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';
import { useParamsFromContext } from '../../contexts/params-from-context';

import { fetcher as api } from '../../lib/api-utils';
import { loggFlyt } from '../../lib/amplitude';
import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { hentRegistreringFeiletUrl } from '../../lib/hent-registrering-feilet-url';
import { FullforRegistreringResponse } from '../../model/registrering';
import { OppgaveRegistreringstype } from '../../model/feilsituasjonTyper';
import byggFullforRegistreringForMerSykmeldtoppfolgingPayload from '../../lib/bygg-registrer-for-mer-sykmeldtoppfolging-payload';

const TEKSTER: Tekster<string> = {
    nb: {
        registrer: 'Registrer for mer sykmeldtoppfølging',
        advarsel: 'Alle spørsmålene i skjemaet må fylles ut før du kan registrere personen for mer oppfølging.',
    },
};

export const RegistrerForMerSykmeldtoppfolgingKnapp = () => {
    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(false);
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { setDoValidate, doValidate, isValid, registrering } = useSykmeldtoppfolging();
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;

    async function registrerArbeidssoker() {
        setIsDisabled(true);
        setDoValidate(true);
        if (isValid) {
            setDoValidate(false);
            setIsDisabled(true);
            const body = byggFullforRegistreringForMerSykmeldtoppfolgingPayload(registrering);
            const registreringUrl = `/api/fullforregistreringsykmeldt?fnr=${fnr}&enhetId=${enhetId}`;
            loggFlyt({ hendelse: 'Sender inn skjema for mer sykmeldtoppfølging' });
            try {
                const response: FullforRegistreringResponse = await api(registreringUrl, {
                    method: 'post',
                    body: JSON.stringify(body),
                });

                const feiltype = response.type;

                if (feiltype) {
                    loggFlyt({
                        hendelse: 'Får ikke fullført registrering for mer sykmeldtoppfølging',
                        aarsak: feiltype,
                    });
                    return router.push(hentRegistreringFeiletUrl(feiltype, OppgaveRegistreringstype.REGISTRERING));
                }

                loggFlyt({ hendelse: 'Registrering for mer sykmeldtoppfølging fullført' });
                return router.push('/kvittering-mer-sykmeldtoppfolging');
            } catch (e) {
                loggFlyt({
                    hendelse: 'Får ikke fullført registrering for mer sykmeldtoppfølging',
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
