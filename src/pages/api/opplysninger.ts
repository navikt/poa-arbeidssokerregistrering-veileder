import { withAuthenticatedApi } from '../../auth/withAuthentication';
import lagArbeidssokerApiKall from '../../lib/lag-arbeidssoker-api-kall';

const url = `${process.env.OPPLYSNINGER_API_URL}/api/v1/arbeidssoker/opplysninger`;

export default withAuthenticatedApi(lagArbeidssokerApiKall(url, { method: 'POST' }));
