import { withAuthenticatedApi } from '../../auth/withAuthentication';
import lagOppslagsApiKall from '../../lib/lag-oppslagsapi-kall';

const url = `${process.env.OPPSLAG_API_URL}/api/v1/veileder/arbeidssoekerperioder`;

export default withAuthenticatedApi(lagOppslagsApiKall(url, { method: 'POST' }));
