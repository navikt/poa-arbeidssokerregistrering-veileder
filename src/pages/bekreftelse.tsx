import { Alert, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { useRouter } from 'next/router';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { useParamsFromContext } from '../contexts/params-from-context';

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
    harVaertIArbeid?: boolean;
    oenskerAaVaereRegistrert?: boolean;
}

const getRadioGroupValue = (skjemVerdi: boolean | undefined) => {
    if (typeof skjemVerdi === 'undefined') {
        return '';
    }
    return skjemVerdi ? 'ja' : 'nei';
};

export default function Bekreftelse() {
    const router = useRouter();
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';

    const [skjemaState, settSkjemaState] = useState<Skjema>({
        harVaertIArbeid: undefined,
        oenskerAaVaereRegistrert: undefined,
    });

    const [isPending, setIsPending] = useState<boolean>(false);
    const [harSendtSkjema, settHarSendtSkjema] = useState<boolean>(false);
    const periode = '03. september - 17. september';

    const [harGyldigSkjema, settHarGyldigSkjema] = useState<boolean>(false);

    useEffect(() => {
        settHarGyldigSkjema(
            Object.values(skjemaState).filter((v) => typeof v !== 'undefined').length ===
                Object.keys(skjemaState).length,
        );
    }, [skjemaState]);

    const onSubmit = async () => {
        setIsPending(true);
        const url = `/api/${brukerMock ? 'mocks' : ''}/rapportering`;
        const payload = JSON.stringify({
            identitetsnummer: fnr,
            harJobbetIDennePerioden: skjemaState.harVaertIArbeid,
            vilFortsetteSomArbeidssoeker: skjemaState.oenskerAaVaereRegistrert,
            // rapporteringsId: TODO
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
        } catch (err: any) {
            console.error('Feil ved posting av bekreftelse', err);
        } finally {
            setIsPending(false);
        }
    };

    const onCancel = () => router.push('/');

    return (
        <>
            <Heading size={'large'}>Bekreftelse</Heading>
            <RadioGroup
                legend={`${tekst('beenWorking')} ${periode}?`}
                value={getRadioGroupValue(skjemaState.harVaertIArbeid)}
                onChange={(e) => settSkjemaState((state) => ({ ...state, harVaertIArbeid: e === 'ja' }))}
                className={'mb-4'}
                disabled={harSendtSkjema}
            >
                <Radio value="ja" checked={skjemaState.harVaertIArbeid === true}>
                    {tekst('yes')}
                </Radio>
                <Radio value="nei" checked={skjemaState.harVaertIArbeid === false}>
                    {tekst('no')}
                </Radio>
            </RadioGroup>

            <RadioGroup
                legend={`${tekst('wantToBeRegistered')}`}
                value={getRadioGroupValue(skjemaState.oenskerAaVaereRegistrert)}
                onChange={(e) => settSkjemaState((state) => ({ ...state, oenskerAaVaereRegistrert: e === 'ja' }))}
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
            {harSendtSkjema && (
                <>
                    <Alert variant={'success'}>
                        <Heading size={'xsmall'}>Svaret er registrert</Heading>
                        <Button variant={'secondary-neutral'} onClick={onCancel}>
                            Lukk og gå tilbake
                        </Button>
                    </Alert>
                </>
            )}
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
