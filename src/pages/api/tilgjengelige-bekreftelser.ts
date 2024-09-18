import lagApiHandlerMedAuthHeaders, { getBekreftelseAPIToken } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

const url = `${process.env.BEKREFTELSE_API_URL}/api/v1/tilgjengelige-bekreftelser?useMockData=true`;

export default withAuthenticatedApi(lagApiHandlerMedAuthHeaders(url, getBekreftelseAPIToken, { method: 'POST' }));
