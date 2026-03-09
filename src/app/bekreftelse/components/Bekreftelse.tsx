'use client';

import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { Alert } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { use, useReducer } from 'react';
import { useModiaContext } from '@/contexts/modia-context';
import type { BekreftelseApiResult } from '@/lib/api/bekreftelse';
import { sendBekreftelse } from '@/lib/api/bekreftelse';
import { loggAktivitet } from '@/lib/tracking';
import { BekreftelseKvittering } from './BekreftelseKvittering';
import { BekreftelseSkjema, type SkjemaValues } from './BekreftelseSkjema';

type BekreftelseState =
    | { status: 'idle'; queueIndex: number }
    | { status: 'submitting'; queueIndex: number }
    | { status: 'submitted'; queueIndex: number; vilFortsette: boolean; hasMore: boolean }
    | { status: 'error'; queueIndex: number; errorMessage: string };

type BekreftelseAction =
    | { type: 'SUBMIT' }
    | { type: 'SUBMIT_SUCCESS'; vilFortsette: boolean; hasMore: boolean }
    | { type: 'SUBMIT_ERROR'; errorMessage: string }
    | { type: 'NEXT' };

function bekreftelseReducer(state: BekreftelseState, action: BekreftelseAction): BekreftelseState {
    switch (action.type) {
        case 'SUBMIT':
            return { status: 'submitting', queueIndex: state.queueIndex };

        case 'SUBMIT_SUCCESS':
            return {
                status: 'submitted',
                queueIndex: state.queueIndex,
                vilFortsette: action.vilFortsette,
                hasMore: action.hasMore,
            };

        case 'SUBMIT_ERROR':
            return { status: 'error', queueIndex: state.queueIndex, errorMessage: action.errorMessage };

        case 'NEXT':
            return { status: 'idle', queueIndex: state.queueIndex + 1 };

        default:
            return state;
    }
}

const initialState: BekreftelseState = { status: 'idle', queueIndex: 0 };

function Bekreftelse({ bekreftelserPromise }: { bekreftelserPromise: Promise<BekreftelseApiResult> }) {
    const { bekreftelser, error: bekreftelserError } = use(bekreftelserPromise);
    const { fnr } = useModiaContext();
    const router = useRouter();

    const [state, dispatch] = useReducer(bekreftelseReducer, initialState);

    if (bekreftelserError) {
        return <Alert variant='error'>Noe gikk dessverre galt. Prøv igjen senere</Alert>;
    }

    if (!bekreftelser || bekreftelser.length === 0) {
        return <p>Ingen tilgjengelige bekreftelser</p>;
    }

    const aktivBekreftelse: TilgjengeligBekreftelse | undefined = bekreftelser[state.queueIndex];

    if (!aktivBekreftelse) {
        return <p>Ingen tilgjengelige bekreftelser</p>;
    }

    const handleSubmit = async (values: SkjemaValues) => {
        dispatch({ type: 'SUBMIT' });
        loggAktivitet({ aktivitet: 'Sender inn bekreftelse på vegne av bruker' });

        const result = await sendBekreftelse({
            identitetsnummer: fnr,
            bekreftelseId: aktivBekreftelse.bekreftelseId,
            harJobbetIDennePerioden: values.harJobbetIDennePerioden,
            vilFortsetteSomArbeidssoeker: values.vilFortsetteSomArbeidssoeker,
        });

        if (result.ok) {
            const hasMore = values.vilFortsetteSomArbeidssoeker && state.queueIndex + 1 < bekreftelser.length;
            dispatch({ type: 'SUBMIT_SUCCESS', vilFortsette: values.vilFortsetteSomArbeidssoeker, hasMore });
        } else {
            const errorMessage =
                'error' in result ? (result.error ?? 'Noe gikk dessverre galt') : 'Noe gikk dessverre galt';
            dispatch({ type: 'SUBMIT_ERROR', errorMessage });
        }
    };

    const handleCancel = () => router.push('/');

    const handleNesteBekreftelse = () => dispatch({ type: 'NEXT' });

    const isSubmitted = state.status === 'submitted';

    return (
        <>
            <BekreftelseSkjema
                key={state.queueIndex}
                bekreftelse={aktivBekreftelse}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isPending={state.status === 'submitting'}
                disabled={isSubmitted}
            />

            {isSubmitted && (
                <BekreftelseKvittering
                    vilFortsetteSomArbeidssoeker={state.vilFortsette}
                    harFlereBekreftelser={state.hasMore}
                    onNesteBekreftelse={handleNesteBekreftelse}
                />
            )}

            {state.status === 'error' && (
                <Alert variant='error' className='my-8'>
                    {state.errorMessage}
                </Alert>
            )}
        </>
    );
}

export { Bekreftelse };
