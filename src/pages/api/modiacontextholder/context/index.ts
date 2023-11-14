import { withAuthenticatedApi } from '../../../../auth/withAuthentication';
import { lagModiaContextKall } from '../../hent-modia-context';

const url = `${process.env.MODIACONTEXTHOLDER_URL}/modiacontextholder/api/context`;
export default withAuthenticatedApi(lagModiaContextKall(url));
