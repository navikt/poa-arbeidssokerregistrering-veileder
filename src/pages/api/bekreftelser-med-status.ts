import { withAuthenticatedApi } from '../../auth/withAuthentication';
import lagOppslagsApiKall from '../../lib/lag-oppslagsapi-kall';

const url = `${process.env.GYLDIGE_BEKREFTELSER_API_URL}/api/v2/bekreftelser`;

export default withAuthenticatedApi(lagOppslagsApiKall(url, { method: 'POST' }));
