import lagApiHandlerMedAuthHeaders from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

const startRegistreringUrl = `${process.env.START_REGISTRERING_URL}`;
const startHandler = lagApiHandlerMedAuthHeaders(startRegistreringUrl);

export default withAuthenticatedApi(startHandler);
