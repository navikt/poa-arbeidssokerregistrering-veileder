import { withAuthenticatedApi } from '../../auth/withAuthentication';
// import lagOppslagsApiKall from '../../lib/lag-oppslagsapi-kall';
import lagOppslagsApiV2Kall from '../../lib/lag-oppslagsapi-v2-kall';

// const url = `${process.env.OPPSLAG_API_URL}/api/v1/veileder/profilering`;
const url = `${process.env.OPPSLAG_API_V2_URL}/api/v1/veileder/profilering`;

// export default withAuthenticatedApi(lagOppslagsApiKall(url, { method: 'POST' }));
export default withAuthenticatedApi(lagOppslagsApiV2Kall(url, { method: 'POST' }));
