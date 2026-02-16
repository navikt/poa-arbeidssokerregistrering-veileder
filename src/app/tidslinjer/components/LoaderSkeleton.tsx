import { Skeleton } from '@navikt/ds-react';
import type React from 'react';

const loaderkeys = ['loader-1', 'loader-2', 'loader-3'];
const LoaderSkeleton: React.FC = () => {
	return (
		<div>
			{loaderkeys.map((key) => (
				<Skeleton key={key} variant='rectangle' width='100%' height={60} className='mb-2' />
			))}
		</div>
	);
};

export { LoaderSkeleton };
