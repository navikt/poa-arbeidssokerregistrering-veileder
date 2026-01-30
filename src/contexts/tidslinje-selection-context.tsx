import { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import React, { createContext, useContext, useState } from 'react';

type TidslinjeSelectionContextType = {
    selectedTidslinje: Periode | null;
    setSelectedTidslinje: (t: Periode | null) => void;
};

const TidslinjeSelectionContext = createContext<TidslinjeSelectionContextType | undefined>(undefined);

export const TidslinjeSelectionProvider: React.FC<{ children: React.ReactNode; initSelected?: Periode | null }> = ({
    children,
    initSelected,
}) => {
    const [selectedTidslinje, setSelectedTidslinje] = useState<Periode | null>(initSelected);
    return (
        <TidslinjeSelectionContext.Provider value={{ selectedTidslinje, setSelectedTidslinje }}>
            {children}
        </TidslinjeSelectionContext.Provider>
    );
};

export const useTidslinjeSelection = () => {
    const ctx = useContext(TidslinjeSelectionContext);
    if (!ctx) throw new Error('useTidslinjeSelection must be used within TidslinjeSelectionProvider');
    return ctx;
};
