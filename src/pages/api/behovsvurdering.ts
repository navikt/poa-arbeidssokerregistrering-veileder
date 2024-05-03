import { withAuthenticatedApi } from '../../auth/withAuthentication';
import { createProxyCall } from '../../lib/proxy-api-kall';
import { getPawArbeidssokerBesvarelseToken, getHeaders } from '../../lib/next-api-handler';

const url = `${process.env.AIA_BACKEND_URL}/veileder/behov-for-veiledning`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

export default withAuthenticatedApi(
    createProxyCall(async (req, callId) => {
        return brukerMock
            ? getHeaders('token', callId)
            : getHeaders(await getPawArbeidssokerBesvarelseToken(req), callId);
    }, url),
);
