import { Tidslinje } from '@navikt/arbeidssokerregisteret-utils';
import React, { createContext, useContext, useState } from 'react';

type TidslinjeSelectionContextType = {
    selectedTidslinje: Tidslinje | null;
    setSelectedTidslinje: (t: Tidslinje | null) => void;
};

const TidslinjeSelectionContext = createContext<TidslinjeSelectionContextType | undefined>(undefined);

export const TidslinjeSelectionProvider: React.FC<{ children: React.ReactNode; initSelected?: Tidslinje | null }> = ({
    children,
    initSelected,
}) => {
    const [selectedTidslinje, setSelectedTidslinje] = useState<Tidslinje | null>(initSelected);

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
