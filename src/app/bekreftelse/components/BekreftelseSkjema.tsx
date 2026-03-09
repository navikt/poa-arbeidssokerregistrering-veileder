'use client';

import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, Button, Radio, RadioGroup } from '@navikt/ds-react';
import { useState } from 'react';
import { formaterDato } from '@/lib/date-utils';

export type SkjemaValues = {
    harJobbetIDennePerioden: boolean;
    vilFortsetteSomArbeidssoeker: boolean;
};

type BekreftelseSkjemaProps = {
    bekreftelse: TilgjengeligBekreftelse;
    onSubmit: (values: SkjemaValues) => void;
    onCancel: () => void;
    isPending: boolean;
    disabled?: boolean;
};

function toRadioValue(value: boolean | undefined): string {
    if (value === undefined) return '';
    return value ? 'ja' : 'nei';
}

function BekreftelseSkjema({ bekreftelse, onSubmit, onCancel, isPending, disabled = false }: BekreftelseSkjemaProps) {
    const [harJobbet, setHarJobbet] = useState<boolean | undefined>(undefined);
    const [vilFortsette, setVilFortsette] = useState<boolean | undefined>(undefined);

    const isValid = harJobbet !== undefined && vilFortsette !== undefined;
    const periode = `${formaterDato(bekreftelse.gjelderFra)} - ${formaterDato(bekreftelse.gjelderTil)}`;

    const handleSubmit = () => {
        if (!isValid) return;
        onSubmit({
            harJobbetIDennePerioden: harJobbet,
            vilFortsetteSomArbeidssoeker: vilFortsette,
        });
    };

    return (
        <>
            <div className='my-4'>
                <RadioGroup
                    legend={`Har personen vært i arbeid i perioden ${periode}?`}
                    value={toRadioValue(harJobbet)}
                    onChange={(val) => setHarJobbet(val === 'ja')}
                    disabled={disabled}
                >
                    <Radio value='ja'>Ja</Radio>
                    <Radio value='nei'>Nei</Radio>
                </RadioGroup>
            </div>

            <div className='mb-4'>
                <RadioGroup
                    legend='Vil personen fortsatt være registrert som arbeidssøker?'
                    value={toRadioValue(vilFortsette)}
                    onChange={(val) => setVilFortsette(val === 'ja')}
                    disabled={disabled}
                >
                    <Radio value='ja'>Ja</Radio>
                    <Radio value='nei'>Nei</Radio>
                </RadioGroup>
            </div>

            {!disabled && vilFortsette === false && (
                <Alert variant='warning' className='mb-4'>
                    Bruker vil ikke lenger være registrert som arbeidssøker, og eventuell pengestøtte vil stanses.
                </Alert>
            )}

            {!disabled && (
                <div className='flex'>
                    <Button variant='primary' disabled={!isValid} onClick={handleSubmit} loading={isPending}>
                        Send inn
                    </Button>
                    <div className='ml-4'>
                        <Button variant='tertiary' onClick={onCancel} disabled={isPending}>
                            Avbryt
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export { BekreftelseSkjema };
