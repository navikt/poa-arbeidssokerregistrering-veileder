'use client';

import { UNSAFE_Combobox } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { navngiComboboxListe } from '@/components/skjema/navngi-combobox-liste';
import { loggAktivitet } from '@/lib/tracking';

type StillingssokValue = {
    konseptId: number;
    label: string;
    styrk08: string;
};

type StillingsSokProps = {
    onClose: (value?: StillingssokValue) => void;
};

const ANNEN_STILLING: StillingssokValue = { konseptId: -1, label: 'Annen stilling', styrk08: '-1' };
const DEBOUNCE_MS = 200;
const SOKEFELT_NAVN = 'Søk etter stilling';

function StillingsSok({ onClose }: StillingsSokProps) {
    const [stillinger, setStillinger] = useState<StillingssokValue[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [harEndret, setHarEndret] = useState(false);
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!inputRef.current || !wrapperRef.current) return;
        return navngiComboboxListe(inputRef.current, wrapperRef.current, SOKEFELT_NAVN);
    }, []);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const unikeStillinger = [...stillinger, ANNEN_STILLING].filter(
        (stilling, index, self) => self.findIndex((s) => s.konseptId === stilling.konseptId) === index,
    );

    const comboboxOptions = unikeStillinger.map((stilling) => ({
        label: stilling.label,
        value: String(stilling.konseptId),
    }));

    const stillingByKonseptId = new Map<string, StillingssokValue>(
        unikeStillinger.map((s) => [String(s.konseptId), s]),
    );

    async function sokEtterStillinger(query: string) {
        if (!query || query.trim().length === 0) {
            setStillinger([]);
            return;
        }

        setIsLoading(true);
        setFeilmelding(undefined);
        try {
            const response = await fetch(`/api/stillingssok?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data: StillingssokValue[] = await response.json();
                setStillinger(data);
            } else {
                setStillinger([]);
                setFeilmelding('Søket feilet. Prøv igjen senere.');
            }
        } catch {
            setStillinger([]);
            setFeilmelding('Søket feilet. Sjekk nettverkstilkoblingen og prøv igjen.');
        } finally {
            setIsLoading(false);
        }
    }

    function onSearchChange(query: string) {
        if (!harEndret) {
            setHarEndret(true);
            loggAktivitet({ aktivitet: 'Endrer foreslått stilling' });
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            sokEtterStillinger(query);
        }, DEBOUNCE_MS);
    }

    function onToggleSelected(option: string, isSelected: boolean) {
        if (!isSelected) return;

        const valgt = stillingByKonseptId.get(option);
        onClose(valgt ?? undefined);
    }

    const handleBlurCapture = useCallback(
        (e: React.FocusEvent) => {
            // If focus moves to something outside the wrapper, close without selecting
            if (wrapperRef.current && !wrapperRef.current.contains(e.relatedTarget as Node)) {
                onClose();
            }
        },
        [onClose],
    );

    return (
        <div ref={wrapperRef} onBlurCapture={handleBlurCapture}>
            <UNSAFE_Combobox
                ref={inputRef}
                label={SOKEFELT_NAVN}
                autoFocus
                options={comboboxOptions}
                filteredOptions={comboboxOptions}
                isLoading={isLoading}
                onChange={onSearchChange}
                onToggleSelected={onToggleSelected}
                shouldAutocomplete
                error={feilmelding}
            />
        </div>
    );
}

export { StillingsSok };
