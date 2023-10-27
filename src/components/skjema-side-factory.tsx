import { SkjemaSide, SkjemaState } from '../model/skjema';
import { Dispatch, useEffect, useReducer, useRef, useState } from 'react';
import { SkjemaAction, skjemaReducer, SkjemaReducer } from '../lib/skjema-state';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styles from '../styles/skjema.module.css';
import TilbakeKnapp from './skjema/tilbake-knapp';
import { Knapperad } from './skjema/knapperad/knapperad';
import Avbryt from './skjema/avbryt-lenke';
import { SykmeldtRegistreringTilstandsmaskin } from '../lib/sykmeldt-registrering-tilstandsmaskin';
import { StandardRegistreringTilstandsmaskin } from '../lib/standard-registrering-tilstandsmaskin';
import ProgressBar from './progress-bar/progress-bar';
import { loggAktivitet } from '../lib/amplitude';

export type SiderMap = { [key: string]: JSX.Element };
export interface SkjemaProps {
    aktivSide: any;
}

export interface LagSkjemaSideProps {
    urlPrefix: 'skjema' | 'sykmeldt';
    validerSkjemaForSide: (side: SkjemaSide, skjemaState: SkjemaState) => boolean;
    hentKomponentForSide: (
        side: SkjemaSide,
        skjemaState: SkjemaState,
        dispatch: Dispatch<SkjemaAction>,
        visFeilmelding: boolean
    ) => JSX.Element;
    beregnNavigering: StandardRegistreringTilstandsmaskin | SykmeldtRegistreringTilstandsmaskin;
}

export type SkjemaSideFactory = (opts: LagSkjemaSideProps) => NextPage<SkjemaProps>;

const initialArgs = () => ({ startTid: Date.now() });
const skjemaSideFactory: SkjemaSideFactory = (opts) => {
    const { beregnNavigering, urlPrefix, validerSkjemaForSide, hentKomponentForSide } = opts;

    const SkjemaSideKomponent = (props: SkjemaProps) => {
        const { aktivSide } = props;
        const router = useRouter();
        const initializer = (skjemaState: SkjemaState) => skjemaState;
        const [erSkjemaSendt, settErSkjemaSendt] = useState<boolean>(false);

        useEffect(() => {
            loggAktivitet({
                aktivitet: 'Start registrering',
            });
        }, []);

        const [skjemaState, dispatch] = useReducer<SkjemaReducer, SkjemaState>(
            skjemaReducer,
            initialArgs(),
            initializer
        );

        const [visFeilmelding, settVisFeilmelding] = useState<boolean>(false);

        const { forrige, neste, fremdrift } = beregnNavigering(aktivSide, skjemaState);

        useEffect(() => {
            // valider at forrige side har gyldig state. Hvis ikke starter vi registrering på nytt
            if (forrige) {
                if (!validerSkjemaForSide(forrige, skjemaState)) {
                    router.push('/start/');
                }
            }

            if (fremdrift < 0) {
                router.push('/start/');
            }
        }, [forrige, router, skjemaState, fremdrift]);

        const navigerTilSide = (side: SkjemaSide) => {
            return router.push(`/${urlPrefix}/${side}`);
        };

        const validerOgGaaTilNeste = () => {
            if (!validerSkjemaForSide(aktivSide, skjemaState)) {
                settVisFeilmelding(true);
                return;
            }

            settVisFeilmelding(false);

            if (neste) {
                return navigerTilSide(neste);
            }
        };

        useEffect(() => {
            if (validerSkjemaForSide(aktivSide, skjemaState)) {
                settVisFeilmelding(false);
            }

            if (aktivSide !== SkjemaSide.FullforRegistrering && erSkjemaSendt) {
                settErSkjemaSendt(false);
            }
        }, [skjemaState, aktivSide, erSkjemaSendt]);

        const forrigeLenke = forrige ? `/${urlPrefix}/${forrige}/` : undefined;

        const dispatcher = (action: SkjemaAction) => {
            if (action.type === 'SenderSkjema') {
                settErSkjemaSendt(true);
            } else {
                dispatch(action);
            }
        };

        const skjemaWrapperRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const inputElement: HTMLInputElement | null | undefined =
                skjemaWrapperRef.current?.querySelector('input[checked]') ||
                skjemaWrapperRef.current?.querySelector('input');
            if (inputElement) {
                inputElement.focus();
            }
        }, [aktivSide]);

        return (
            <div ref={skjemaWrapperRef} className={styles.main}>
                <ProgressBar value={erSkjemaSendt ? 1 : fremdrift} className={'mbm'} />
                {forrigeLenke && (
                    <div className={styles.forrigeLenke}>
                        <TilbakeKnapp href={forrigeLenke} />
                    </div>
                )}
                {hentKomponentForSide(aktivSide, skjemaState, dispatcher, visFeilmelding)}
                {neste && <Knapperad onNeste={validerOgGaaTilNeste} />}
                <Avbryt />
            </div>
        );
    };

    return SkjemaSideKomponent;
};

export default skjemaSideFactory;
