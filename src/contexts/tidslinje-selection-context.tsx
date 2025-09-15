import React, { createContext, useContext, useState } from 'react';
import { Tidslinje } from '../model/schema-api.types';

type TidslinjeSelectionContextType = {
    selectedTidslinje: Tidslinje | null;
    setSelectedTidslinje: (t: Tidslinje | null) => void;
};

const TidslinjeSelectionContext = createContext<TidslinjeSelectionContextType | undefined>(undefined);

export const TidslinjeSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedTidslinje, setSelectedTidslinje] = useState<Tidslinje | null>(null);

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
