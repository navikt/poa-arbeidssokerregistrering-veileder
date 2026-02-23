import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import { getOboTokenFromRequest } from '@/app/lib/auth/oboToken';
import { hentModiaHeaders } from '@/app/lib/modia-headers';
import { isProblemDetails, type ProblemDetails } from '@/app/lib/types/problem-details';

type FetchSuccess<T> = { ok: true; data: T };
type FetchFailure = { ok: false; error: Error };
type FetchResult<T> = FetchSuccess<T> | FetchFailure;

type AuthenticatedFetchOptions = {
    url: string;
    scope: string;
    headers: Headers;
    method?: 'GET' | 'POST';
    body?: unknown;
};

async function authenticatedFetch<T>(options: AuthenticatedFetchOptions): Promise<FetchResult<T>> {
    const { url, scope, headers, method = 'GET', body } = options;

    const oboToken = await getOboTokenFromRequest(headers, scope);

    if (!oboToken.ok) {
        const { error } = oboToken as { ok: false; error: Error };
        return { ok: false, error };
    }

    const traceId = headers.get('x-trace-id') ?? nanoid();
    const modiaHeader = hentModiaHeaders(oboToken.token, traceId);

    try {
        const response = await fetch(url, {
            method,
            body: body ? JSON.stringify(body) : null,
            headers: modiaHeader,
        });

        if (!response.ok) {
            let problemDetails: ProblemDetails | null = null;
            try {
                problemDetails = await response.json();
                if (isProblemDetails(problemDetails)) {
                    logger.error({
                        message: `Feil fra API: ${problemDetails.status} ${problemDetails.title} - ${problemDetails.detail || 'ingen detaljer gitt'}`,
                    });
                }
            } catch (_e) {} // Ignore JSON parse errors

            // - Dersom det ikke er RFC 9457, logg generisk error
            if (!problemDetails) {
                logger.error({
                    message: `Feil fra API: ${response.status} ${response.statusText}`,
                });
            }
            const errorMsg = problemDetails?.detail
                ? `${problemDetails.status} ${problemDetails.title} - ${problemDetails.detail}`
                : `${response.status} ${response.statusText}`;

            return { ok: false, error: new Error(errorMsg) };
        }
        return { ok: true, data: (await response.json()) as T };
    } catch (e) {
        return { ok: false, error: new Error(`Fetch failed`, { cause: e }) };
    }
}

export { authenticatedFetch };
