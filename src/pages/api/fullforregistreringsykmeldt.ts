import { lagApiPostHandlerMedAuthHeaders } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

const fullforRegistreringSykmeldtUrl = `${process.env.FULLFOR_REGISTRERING_SYKMELDT_URL}`;
const fullforHandler = lagApiPostHandlerMedAuthHeaders(fullforRegistreringSykmeldtUrl);

export default withAuthenticatedApi(fullforHandler);
