import React, { createContext, ReactNode, useContext, useState } from 'react';

type VisningsType = 'expanded' | 'collapsed';
type VisningsTypeContextType = {
    visningsType: VisningsType;
    toggleVisningsType: () => void;
};

export const VisningTypeContext = createContext<VisningsTypeContextType>({
    visningsType: 'collapsed',
    toggleVisningsType: () => {},
});

interface VisningsTypeProviderProps {
    children: ReactNode;
}

export const VisningsTypeProvider: React.FC<VisningsTypeProviderProps> = ({ children }) => {
    const [visningsType, setVisningsType] = useState<VisningsType>('collapsed');
    const toggleVisningsType = () => {
        setVisningsType(visningsType === 'expanded' ? 'collapsed' : 'expanded');
    };

    return (
        <VisningTypeContext.Provider value={{ visningsType, toggleVisningsType }}>
            {children}
        </VisningTypeContext.Provider>
    );
};

export const useVisningTypeContext = (): VisningsTypeContextType => {
    const context = useContext(VisningTypeContext);
    if (!context) {
        throw new Error('useVisningTypeContext must be used within a VisningsTypeProvider');
    }
    return context;
};
