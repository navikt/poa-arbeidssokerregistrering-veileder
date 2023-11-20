import { withAuthenticatedApi } from '../../../auth/withAuthentication';
import { createProxyCall } from '../../../lib/proxy-api-kall';
import { getHeaders, getPawProxyToken } from '../../../lib/next-api-handler';

// const url = `${process.env.VEILARBOPPFOLGING_URL}/api/[slug]`;
const url = `${process.env.PAW_PROXY_URL}/veilarboppfolging/api/[slug]`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';
export default withAuthenticatedApi(
    createProxyCall(async (req, callId) => {
        // return brukerMock ? getHeaders('token', callId) : getHeaders(await getVeilarboppfolgingToken(req), callId);
        return brukerMock ? getHeaders('token', callId) : getHeaders(await getPawProxyToken(req), callId);
    }, url),
);
