import { withAuthenticatedApi } from '../../auth/withAuthentication';
import lagOppslagsApiV2Kall from '../../lib/lag-oppslagsapi-v2-kall';

const url = `${process.env.OPPSLAG_API_V2_URL}/api/v2/bekreftelser`;

export default withAuthenticatedApi(lagOppslagsApiV2Kall(url, { method: 'POST' }));
