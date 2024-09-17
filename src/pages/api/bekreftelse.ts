import { withAuthenticatedApi } from '../../auth/withAuthentication';
import lagApiHandlerMedAuthHeaders, { getBekreftelseAPIToken } from '../../lib/next-api-handler';

const url = `${process.env.BEKREFTELSE_API_URL}/api/v1/bekreftelse`;

export default withAuthenticatedApi(lagApiHandlerMedAuthHeaders(url, getBekreftelseAPIToken, { method: 'POST' }));
