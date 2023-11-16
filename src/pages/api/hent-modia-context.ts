import { getHeaders, getModiacontextholderToken } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';
import { createProxyCall } from '../../lib/proxy-api-kall';

const url = `${process.env.MODIACONTEXTHOLDER_URL}/modiacontextholder/api/context/`;
const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

export const lagModiaContextKall = (url) =>
    createProxyCall(async (req, callId) => {
        return brukerMock ? getHeaders('token', callId) : getHeaders(await getModiacontextholderToken(req), callId);
    }, url);
export default withAuthenticatedApi(lagModiaContextKall(url));
