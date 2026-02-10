'use client';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { use } from 'react';

type TidslinjerProps = {
	perioderPromise: Promise<{
		perioder: Periode[] | null;
		error?: Error;
	}>;
};

const Tidslinjer: React.FC<TidslinjerProps> = (props) => {
	const { perioderPromise } = props;
	const { perioder, error } = use(perioderPromise);

	if (error) {
		return 'error...';
	}

	if (!perioder || perioder.length === 0) {
		return 'ingen perioder';
	}

	return (
		<div>
			{perioder?.map((periode) => (
				<div key={periode.periodeId}>{periode.periodeId}</div>
			))}
		</div>
	);
};

export { Tidslinjer };
