'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

export type ModiaContextType = {
	fnr: string | null;
	enhetId: string | null;
	setFnr: (fnr: string | null) => void;
	setEnhetId: (enhetId: string | null) => void;
};

const ModiaContext = createContext<ModiaContextType | null>(null);

type ModiaContextProps = {
	children: ReactNode;
	initFnr: string | null;
	initEnhetId: string | null;
};

function ModiaProvider({ children, initFnr, initEnhetId }: ModiaContextProps) {
	const [fnr, setFnr] = useState(initFnr);
	const [enhetId, setEnhetId] = useState(initEnhetId);

	return (
		<ModiaContext.Provider
			value={{
				fnr,
				enhetId,
				setFnr,
				setEnhetId,
			}}
		>
			{children}
		</ModiaContext.Provider>
	);
}

function useModiaContext() {
	const context = useContext(ModiaContext);
	if (!context) {
		throw new Error('useModia must be used within a ModiaProvider');
	}
	return context;
}

export { ModiaProvider, useModiaContext };
