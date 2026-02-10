import { Heading } from '@navikt/ds-react';
import { Suspense } from 'react';
import { TidslinjeWrapper } from '@/app/tidslinjer/TidslinjeWrapper';
import TilbakeTilForside from '@/components/tilbake-til-forside';
import { hentModiaContext } from '../lib/modia-context-api';
import { getPerioder } from './actions';

export default async function TidslinjerPage() {
	const modiaContext = await hentModiaContext();
	const perioderPromise = getPerioder(modiaContext.fnr);

	return (
		<div>
			<TilbakeTilForside sidenavn='Arbeidssøkerhistorikk' />
			<Heading size={'large'}>Tidslinjer for arbeidssøker</Heading>
			<div className={'flex flex-col max-w-3xl'}>
				<Suspense fallback={<div>Loading...</div>}>
					<TidslinjeWrapper initialPerioderPromise={perioderPromise} />
				</Suspense>
			</div>
		</div>
	);
}
