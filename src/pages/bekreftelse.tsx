import { Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { useRouter } from 'next/router';
import { withAuthenticatedPage } from '../auth/withAuthentication';

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

    const [skjemaState, settSkjemaState] = useState<Skjema>({
        harVaertIArbeid: undefined,
        oenskerAaVaereRegistrert: undefined,
    });

    const periode = '03. september - 17. september';

    const [harGyldigSkjema, settHarGyldigSkjema] = useState<boolean>(false);

    useEffect(() => {
        settHarGyldigSkjema(
            Object.values(skjemaState).filter((v) => typeof v !== 'undefined').length ===
                Object.keys(skjemaState).length,
        );
    }, [skjemaState]);

    const onSubmit = () => {
        console.log('onSubmit:', skjemaState);
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
            >
                <Radio value="ja">{tekst('yes')}</Radio>
                <Radio value="nei">{tekst('no')}</Radio>
            </RadioGroup>

            <div className={'flex'}>
                <Button variant="primary" disabled={!harGyldigSkjema} onClick={onSubmit}>
                    {tekst('submit')}
                </Button>
                <Button className={'ml-4'} variant={'tertiary'} onClick={onCancel}>
                    {tekst('cancel')}
                </Button>
            </div>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
