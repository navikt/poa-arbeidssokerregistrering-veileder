import { withAuthenticatedApi } from '../../../auth/withAuthentication';
import { createProxyCall } from '../../../lib/proxy-api-kall';
import {
    getHeaders,
    getVeilarboppfolgingToken,
    getVeilarbpersonToken,
    getVeilarbveilederToken,
} from '../../../lib/next-api-handler';

const url = `${process.env.VEILARBVEILEDER_URL}/api/[slug]`;
const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
export default withAuthenticatedApi(
    createProxyCall(async (req, callId) => {
        return brukerMock ? getHeaders('token', callId) : getHeaders(await getVeilarbveilederToken(req), callId);
    }, url),
);
