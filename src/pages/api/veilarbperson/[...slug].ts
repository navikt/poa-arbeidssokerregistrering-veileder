import { withAuthenticatedApi } from '../../../auth/withAuthentication';
import { createProxyCall } from '../../../lib/proxy-api-kall';
import { getHeaders, getVeilarbpersonToken } from '../../../lib/next-api-handler';

const url = `${process.env.VEILARBPERSON_URL}/api/[slug]`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';
export default withAuthenticatedApi(
    createProxyCall(async (req, callId) => {
        return brukerMock ? getHeaders('token', callId) : getHeaders(await getVeilarbpersonToken(req), callId);
    }, url),
);
