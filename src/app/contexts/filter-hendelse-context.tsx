import type { HendelseType } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import type React from 'react';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { ALLE_HENDELSER } from '@/lib/alle-hendelser';

const LOCAL_STORAGE_KEY = 'historikk-hendelse-filter';

function parseFiltersFromString(parsedJson: unknown): HendelseType[] {
    if (!parsedJson) return defaultFilters;
    if (!Array.isArray(parsedJson)) return defaultFilters;

    const validatedFilters = parsedJson
        .filter((f: unknown) => typeof f === 'string' || typeof f === 'number')
        .filter((f) => ALLE_HENDELSER.includes(f as HendelseType)) as HendelseType[];

    return validatedFilters;
}

function parseLocalStorageSafely(): HendelseType[] {
    if (typeof window === 'undefined') return defaultFilters;
    try {
        const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return defaultFilters;
        const parsed = JSON.parse(raw);
        return parseFiltersFromString(parsed);
    } catch {
        return defaultFilters;
    }
}

type FilterContextType = {
    filters: HendelseType[];
    toggleFilter: (filter: HendelseType) => void;
    resetFiltersToDefault: () => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: HendelseType[] = ALLE_HENDELSER;

type FilterProviderProps = {
    children: ReactNode;
};

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
    const [filters, setFilters] = useState<HendelseType[]>(defaultFilters);

    useEffect(() => {
        const stored = parseLocalStorageSafely();
        if (JSON.stringify(stored) !== JSON.stringify(defaultFilters)) {
            setFilters(stored);
        }
    }, []);

    const toggleFilter = (filter: HendelseType) => {
        setFilters((prev) => {
            const exists = prev.includes(filter);
            if (exists) {
                return prev.filter((f) => f !== filter);
            } else {
                return [...prev, filter];
            }
        });
    };

    const resetFiltersToDefault = () => {
        setFilters(defaultFilters);
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
        } catch (_e) {}
    }, [filters]);

    return (
        <FilterContext.Provider value={{ filters, toggleFilter, resetFiltersToDefault }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilterContext = (): FilterContextType => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilterContext must be used within a FilterProvider');
    }
    return context;
};
