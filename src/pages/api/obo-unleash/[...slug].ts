import { withAuthenticatedApi } from '../../../auth/withAuthentication';
import { createProxyCall } from '../../../lib/proxy-api-kall';
import {
    getHeaders,
    getOboUnleashToken,
    getVeilarbdialogToken,
    getVeilarboppfolgingToken,
} from '../../../lib/next-api-handler';

const url = `${process.env.OBO_UNLEASH_URL}/obo-unleash/[slug]`;
const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
export default withAuthenticatedApi(
    createProxyCall(async (req, callId) => {
        return brukerMock ? getHeaders('token', callId) : getHeaders(await getOboUnleashToken(req), callId);
    }, url),
);
