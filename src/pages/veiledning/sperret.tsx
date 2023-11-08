import alleredeRegistrert from './allerede-registrert';
import { withAuthenticatedPage } from '../../auth/withAuthentication';
export const getServerSideProps = withAuthenticatedPage();
export default alleredeRegistrert;
