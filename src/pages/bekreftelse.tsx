import { Alert, Button, Heading, Link, Radio, RadioGroup } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { useRouter } from 'next/router';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { useParamsFromContext } from '../contexts/params-from-context';
import { formaterDato } from '../lib/date-utils';
import { TilgjengeligBekreftelse, TilgjengeligeBekreftelser } from '../types/bekreftelse';
import useApiKall from '../hooks/useApiKall';
import TilbakeTilForside from '../components/tilbake-til-forside';

const TEKSTER = {
    nb: {
        beenWorking: 'Har personen vært i arbeid i perioden ',
        yes: 'Ja',
        no: 'Nei',
        wantToBeRegistered: 'Vil personen fortsatt være registrert som arbeidssøker?',
        submit: 'Send inn',
        cancel: 'Avbryt',
    },
};

interface Skjema {
    harJobbetIDennePerioden?: boolean;
    vilFortsetteSomArbeidssoeker?: boolean;
}

const getRadioGroupValue = (skjemaVerdi: boolean | undefined) => {
    if (typeof skjemaVerdi === 'undefined') {
        return '';
    }
    return skjemaVerdi ? 'ja' : 'nei';
};

export default function Bekreftelse() {
    const router = useRouter();
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';
    const { data: apiData, isLoading } = useApiKall<TilgjengeligeBekreftelser>(
        `/api/${brukerMock ? 'mocks/' : ''}tilgjengelige-bekreftelser`,
        'POST',
        fnr ? JSON.stringify({ identitetsnummer: fnr }) : null,
    );

    const [tilgjengeligeBekreftelser, settTilgjengeligeBekreftelser] = useState<TilgjengeligeBekreftelser>();
    const [aktivBekreftelse, settAktivBekreftelse] = useState<TilgjengeligBekreftelse>();

    const [skjemaState, settSkjemaState] = useState<Skjema>({
        harJobbetIDennePerioden: undefined,
        vilFortsetteSomArbeidssoeker: undefined,
    });

    const [isPending, setIsPending] = useState<boolean>(false);
    const [harSendtSkjema, settHarSendtSkjema] = useState<boolean>(false);
    const [harGyldigSkjema, settHarGyldigSkjema] = useState<boolean>(false);
    const [apiError, setApiError] = useState<undefined | { data?: any }>(undefined);

    useEffect(() => {
        settHarGyldigSkjema(
            Object.values(skjemaState).filter((v) => typeof v !== 'undefined').length ===
                Object.keys(skjemaState).length,
        );
    }, [skjemaState]);

    useEffect(() => {
        if (apiData) {
            settTilgjengeligeBekreftelser(
                apiData.sort((a, b) => {
                    // TODO: sorter server-side ??
                    return new Date(a.gjelderTil).getTime() - new Date(b.gjelderTil).getTime();
                }),
            );
        }
    }, [apiData]);

    useEffect(() => {
        if (tilgjengeligeBekreftelser && tilgjengeligeBekreftelser.length > 0) {
            const bekreftelse = tilgjengeligeBekreftelser[0];
            settAktivBekreftelse(bekreftelse);
        }
    }, [tilgjengeligeBekreftelser]);

    if (isLoading || !tilgjengeligeBekreftelser) {
        return null;
    }

    if (apiData.length === 0) {
        return <p>Ingen tilgjengelige bekreftelser</p>;
    }

    const onSubmit = async () => {
        setIsPending(true);
        setApiError(undefined);
        const url = `/api/${brukerMock ? 'mocks/' : ''}bekreftelse`;
        const payload = JSON.stringify({
            identitetsnummer: fnr,
            harJobbetIDennePerioden: skjemaState.harJobbetIDennePerioden,
            vilFortsetteSomArbeidssoeker: skjemaState.vilFortsetteSomArbeidssoeker,
            bekreftelseId: aktivBekreftelse.bekreftelseId,
        });
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (!response.ok) {
                const error: any = new Error(response.statusText);
                try {
                    error.data = await response.json();
                } catch (e) {}
                throw error;
            }

            settHarSendtSkjema(true);

            if (skjemaState.vilFortsetteSomArbeidssoeker) {
                settTilgjengeligeBekreftelser((prevState) => prevState.slice(1));
            } else {
                settTilgjengeligeBekreftelser([]);
            }
        } catch (err: any) {
            console.error('Feil ved posting av bekreftelse', err);
            setApiError(err);
        } finally {
            setIsPending(false);
        }
    };

    const onCancel = () => router.push('/');
    const onClickNesteBekreftelse = () => {
        settSkjemaState({
            harJobbetIDennePerioden: undefined,
            vilFortsetteSomArbeidssoeker: undefined,
        });

        if (tilgjengeligeBekreftelser.length > 0) {
            settHarSendtSkjema(false);
        }
    };

    const periode = `${formaterDato(aktivBekreftelse?.gjelderFra)} - ${formaterDato(aktivBekreftelse?.gjelderTil)}`;

    return (
        <>
            <TilbakeTilForside sidenavn="Bekreftelse" />
            <Heading size={'large'}>Bekreftelse</Heading>
            <div className={'my-4'}>
                <RadioGroup
                    legend={`${tekst('beenWorking')} ${periode}?`}
                    value={getRadioGroupValue(skjemaState.harJobbetIDennePerioden)}
                    onChange={(e) => settSkjemaState((state) => ({ ...state, harJobbetIDennePerioden: e === 'ja' }))}
                    disabled={harSendtSkjema}
                >
                    <Radio value="ja" checked={skjemaState.harJobbetIDennePerioden === true}>
                        {tekst('yes')}
                    </Radio>
                    <Radio value="nei" checked={skjemaState.harJobbetIDennePerioden === false}>
                        {tekst('no')}
                    </Radio>
                </RadioGroup>
            </div>

            <div className={'mb-4'}>
                <RadioGroup
                    legend={`${tekst('wantToBeRegistered')}`}
                    value={getRadioGroupValue(skjemaState.vilFortsetteSomArbeidssoeker)}
                    onChange={(e) =>
                        settSkjemaState((state) => ({ ...state, vilFortsetteSomArbeidssoeker: e === 'ja' }))
                    }
                    disabled={harSendtSkjema}
                >
                    <Radio value="ja">{tekst('yes')}</Radio>
                    <Radio value="nei">{tekst('no')}</Radio>
                </RadioGroup>
            </div>

            {!harSendtSkjema && skjemaState.vilFortsetteSomArbeidssoeker === false && (
                <Alert variant={'warning'} className={'mb-4'}>
                    Bruker vil ikke lenger være registrert som arbeidssøker, og eventuelle ytelser vil stanses.
                </Alert>
            )}

            {!harSendtSkjema && (
                <div className={'flex'}>
                    <Button variant="primary" disabled={!harGyldigSkjema} onClick={onSubmit} loading={isPending}>
                        {tekst('submit')}
                    </Button>
                    <div className={'ml-4'}>
                        <Button variant={'tertiary'} onClick={onCancel} disabled={isPending}>
                            {tekst('cancel')}
                        </Button>
                    </div>
                </div>
            )}

            {harSendtSkjema && tilgjengeligeBekreftelser.length === 0 && (
                <>
                    <Alert
                        variant={skjemaState.vilFortsetteSomArbeidssoeker ? 'success' : 'warning'}
                        className={'mb-4'}
                    >
                        <Heading size={'xsmall'}>
                            {skjemaState.vilFortsetteSomArbeidssoeker
                                ? 'Bekreftelsen er registrert'
                                : 'Bruker er ikke lenger registrert som arbeidssøker'}
                        </Heading>
                    </Alert>
                    <Link href={'/'}>Gå tilbake til forsiden</Link>
                </>
            )}

            {harSendtSkjema && tilgjengeligeBekreftelser.length > 0 && (
                <>
                    <Alert variant={'success'} className={'mb-4'}>
                        <Heading size={'xsmall'}>Bekreftelsen er registrert</Heading>
                    </Alert>
                    <div className={'navds-alert__wrapper--maxwidth'}>
                        <Button variant={'secondary'} onClick={onClickNesteBekreftelse}>
                            Svar for neste periode
                        </Button>
                    </div>
                </>
            )}
            {apiError && (
                <Alert variant={'error'} className={'my-8'}>
                    Noe gikk dessverre galt
                    {apiError?.data && (
                        <div>
                            <pre>{JSON.stringify(apiError.data, null, 2)}</pre>
                        </div>
                    )}
                </Alert>
            )}
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
