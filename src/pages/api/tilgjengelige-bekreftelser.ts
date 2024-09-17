import lagApiHandlerMedAuthHeaders, { getBekreftelseAPIToken } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

const url = `${process.env.BEKREFTELSE_API_URL}/api/v1/tilgjengelige-bekreftelser`;

export default withAuthenticatedApi(lagApiHandlerMedAuthHeaders(url, getBekreftelseAPIToken));
