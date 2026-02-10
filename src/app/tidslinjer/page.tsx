import { hentModiaContext } from '../lib/modia-context-api';
import { getPerioder } from './actions';

export default async function TidslinjerPage() {
	const modia = await hentModiaContext();
	const perioder = await getPerioder(modia.fnr);

	return (
		<div>
			<div>Tidslinjer Page - Du har {perioder.perioder?.length} perioder.</div>
			<div>{perioder.error && <div>Error: {perioder.error.message}</div>}</div>
		</div>
	);
}
