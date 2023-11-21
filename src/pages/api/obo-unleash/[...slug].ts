import { withAuthenticatedApi } from '../../../auth/withAuthentication';
import { createProxyCall } from '../../../lib/proxy-api-kall';
import {
    getHeaders,
    getOboUnleashToken,
    getVeilarbdialogToken,
    getVeilarboppfolgingToken,
} from '../../../lib/next-api-handler';

const url = `${process.env.OBO_UNLEASH_URL}/[slug]`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';
export default withAuthenticatedApi(
    createProxyCall(async (req, callId) => {
        return brukerMock ? getHeaders('token', callId) : getHeaders(await getOboUnleashToken(req), callId);
    }, url),
);
