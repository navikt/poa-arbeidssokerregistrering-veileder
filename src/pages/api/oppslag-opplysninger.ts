import { withAuthenticatedApi } from '../../auth/withAuthentication';
import lagArbeidssokerApiKall from '../../lib/lag-arbeidssoker-api-kall';

const url = `${process.env.OPPSLAG_API_URL}/api/v1/veileder/opplysninger-om-arbeidssoeker`;

export default withAuthenticatedApi(lagArbeidssokerApiKall(url, { method: 'POST' }));
