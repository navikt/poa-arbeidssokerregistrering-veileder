import { Alert, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { useRouter } from 'next/router';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { useParamsFromContext } from '../contexts/params-from-context';
import useSWRImmutable from 'swr/immutable';
import { fetcher } from '../lib/api-utils';
import { formaterDato } from '../lib/date-utils';
import { TilgjengeligBekreftelse, TilgjengeligeBekreftelser } from '../types/bekreftelse';

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

    const { data: apiData, isLoading } = useSWRImmutable(
        `/api/${brukerMock ? 'mocks/' : ''}tilgjengelige-bekreftelser`,
        fetcher,
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

    useEffect(() => {
        settHarGyldigSkjema(
            Object.values(skjemaState).filter((v) => typeof v !== 'undefined').length ===
                Object.keys(skjemaState).length,
        );
    }, [skjemaState]);

    useEffect(() => {
        if (apiData) {
            settTilgjengeligeBekreftelser(apiData);
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
                throw new Error(response.statusText);
            }

            settHarSendtSkjema(true);

            if (skjemaState.vilFortsetteSomArbeidssoeker) {
                settTilgjengeligeBekreftelser((prevState) => prevState.slice(1));
            } else {
                settTilgjengeligeBekreftelser([]);
            }
        } catch (err: any) {
            console.error('Feil ved posting av bekreftelse', err);
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
            <Heading size={'large'}>Bekreftelse</Heading>
            <RadioGroup
                legend={`${tekst('beenWorking')} ${periode}?`}
                value={getRadioGroupValue(skjemaState.harJobbetIDennePerioden)}
                onChange={(e) => settSkjemaState((state) => ({ ...state, harJobbetIDennePerioden: e === 'ja' }))}
                className={'mb-4'}
                disabled={harSendtSkjema}
            >
                <Radio value="ja" checked={skjemaState.harJobbetIDennePerioden === true}>
                    {tekst('yes')}
                </Radio>
                <Radio value="nei" checked={skjemaState.harJobbetIDennePerioden === false}>
                    {tekst('no')}
                </Radio>
            </RadioGroup>

            <RadioGroup
                legend={`${tekst('wantToBeRegistered')}`}
                value={getRadioGroupValue(skjemaState.vilFortsetteSomArbeidssoeker)}
                onChange={(e) => settSkjemaState((state) => ({ ...state, vilFortsetteSomArbeidssoeker: e === 'ja' }))}
                className={'mb-4'}
                disabled={harSendtSkjema}
            >
                <Radio value="ja">{tekst('yes')}</Radio>
                <Radio value="nei">{tekst('no')}</Radio>
            </RadioGroup>

            {!harSendtSkjema && (
                <div className={'flex'}>
                    <Button variant="primary" disabled={!harGyldigSkjema} onClick={onSubmit} aria-busy={isPending}>
                        {tekst('submit')}
                    </Button>
                    <Button className={'ml-4'} variant={'tertiary'} onClick={onCancel}>
                        {tekst('cancel')}
                    </Button>
                </div>
            )}

            {harSendtSkjema && tilgjengeligeBekreftelser.length === 0 && (
                <Alert variant={skjemaState.vilFortsetteSomArbeidssoeker ? 'success' : 'warning'}>
                    <Heading size={'xsmall'}>
                        {skjemaState.vilFortsetteSomArbeidssoeker
                            ? 'Svaret er registrert'
                            : 'Bruker er ikke lenger registrert som arbeidssøker'}
                    </Heading>
                    <Button variant={'secondary-neutral'} onClick={onCancel}>
                        Lukk og gå tilbake
                    </Button>
                </Alert>
            )}

            {harSendtSkjema && tilgjengeligeBekreftelser.length > 0 && (
                <Alert variant={'success'}>
                    <Heading size={'xsmall'}>Svaret er registrert</Heading>
                    <Button variant={'secondary'} onClick={onClickNesteBekreftelse}>
                        Svar på neste periode
                    </Button>
                </Alert>
            )}
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
