'use client';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Loader } from '@navikt/ds-react';
import { Suspense, useEffect, useRef, useState, useTransition } from 'react';
import { useModiaContext } from '../../contexts/modia-context';
import { getPerioder } from '../actions';
import { LoaderSkeleton } from './LoaderSkeleton';
import { Tidslinjer } from './Tidslinjer';

type TidslinjerWrapperProps = {
	initialPerioderPromise: Promise<{
		perioder: Periode[] | null;
		error?: Error;
	}>;
};

const TidslinjeWrapper: React.FC<TidslinjerWrapperProps> = ({ initialPerioderPromise }) => {
	const { fnr } = useModiaContext();
	const [perioderPromise, setPerioderPromise] = useState(initialPerioderPromise);
	const [isPending, startTransition] = useTransition();
	const isInitialMount = useRef(true);

	useEffect(() => {
		// Skip the first run — we already have server-fetched data
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		// fnr changed client-side (e.g., via the decorator) — refetch
		startTransition(() => {
			setPerioderPromise(getPerioder(fnr));
		});
	}, [fnr]);

	return (
		<Suspense fallback={<LoaderSkeleton />}>
			{isPending && <Loader size='medium' title='Henter tidslinjer' />}
			<Tidslinjer perioderPromise={perioderPromise} />
		</Suspense>
	);
};

export { TidslinjeWrapper };
