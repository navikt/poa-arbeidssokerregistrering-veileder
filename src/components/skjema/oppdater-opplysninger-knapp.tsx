import { Button } from '@navikt/ds-react';
import { forwardRef, useEffect, useState } from 'react';
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
        oppdater: 'Oppdater opplysninger for arbeidssøker',
        registrer: 'Registrer arbeidssøker',
        advarsel: 'Alle spørsmålene i skjemaet må være fylt ut før du kan oppdatere opplysningerne.',
    },
    en: {
        oppdater: 'Updated information of job seeker',
    },
};

interface OppdaterOpplysningerKnappProps {
    erRegistreringsKnapp?: boolean;
    erForhaandsgodkjent: boolean;
}

export const OppdaterOpplysningerKnapp = forwardRef<HTMLButtonElement, OppdaterOpplysningerKnappProps>(
    function OppdaterOpplysningerKnappKomponent(props, ref) {
        const { erRegistreringsKnapp, erForhaandsgodkjent } = props;
        const router = useRouter();
        const [isDisabled, setIsDisabled] = useState(false);
        const [isPending, setIsPending] = useState(false);
        const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
        const { setDoValidate, doValidate, isValid, registrering } = useRegistrering();
        const { params } = useParamsFromContext();
        const { enableMock } = useConfig() as Config;
        const { fnr } = params;
        const brukerMock = enableMock === 'enabled';
        const periodeVersjon = 'arbeidssokerperioder-v2';

        const [periodeStartet, setPeriodeStartet] = useState<boolean>(false);
        const [error, setError] = useState<any>(undefined);

        const startArbeidssoekerperiodeUrl = brukerMock ? `/api/mocks/${periodeVersjon}` : `/api/${periodeVersjon}`;
        const opplysningerUrl = brukerMock ? '/api/mocks/opplysninger' : '/api/opplysninger';

        async function startArbeidssoekerperiode() {
            const payload = JSON.stringify({
                identitetsnummer: fnr,
                periodeTilstand: 'STARTET',
                registreringForhaandsGodkjentAvAnsatt: erForhaandsgodkjent,
            });

            try {
                const response = await fetch(startArbeidssoekerperiodeUrl, {
                    method: 'PUT',
                    body: payload,
                    credentials: 'include',
                    headers: {
                        'Content-type': 'application/json',
                    },
                });
                if (response.ok) {
                    setPeriodeStartet(true);
                } else {
                    // noinspection ExceptionCaughtLocallyJS
                    const data = await response.json();
                    setError(data);
                }
            } catch (err: unknown) {
                setError(err);
            }
        }

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
                        return erRegistreringsKnapp
                            ? router.push('/kvittering-arbeidssoker')
                            : router.push('/kvittering-oppdatert-opplysninger');
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
                <Button
                    ref={ref}
                    variant="primary"
                    onClick={() => {
                        erRegistreringsKnapp
                            ? oppdaterOpplysninger() && startArbeidssoekerperiode()
                            : oppdaterOpplysninger();
                    }}
                    disabled={isDisabled}
                    loading={isPending}
                >
                    {tekst(erRegistreringsKnapp ? 'registrer' : 'oppdater')}
                </Button>
            </div>
        );
    },
);
