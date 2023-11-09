import { ApiError, lagApiPostHandlerMedAuthHeaders } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

const reaktiveringUrl = `${process.env.REAKTIVERING_URL}`;

const errorHandler = (response: Response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        const error = new Error(response.statusText) as ApiError;
        error.status = response.status;
        throw error;
    }
};

const reaktiveringHandler = lagApiPostHandlerMedAuthHeaders(reaktiveringUrl, errorHandler);

export default withAuthenticatedApi(reaktiveringHandler);
