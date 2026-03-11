import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import { getOboTokenFromRequest } from '@/lib/auth/oboToken';
import { hentModiaHeaders } from '@/lib/modia-headers';
import { isProblemDetails, type ProblemDetails } from '@/model/problem-details';

type FetchSuccess<T> = { ok: true; data: T };
type FetchFailure<E = ProblemDetails> = {
    ok: false;
    error: Error;
    status?: number;
    problemDetails?: E;
};
type FetchResult<T, E = ProblemDetails> = FetchSuccess<T> | FetchFailure<E>;

type AuthenticatedFetchOptions = {
    url: string;
    scope: string;
    headers: Headers;
    method?: 'GET' | 'POST' | 'PUT';
    body?: unknown;
};

async function authenticatedFetch<T, E = ProblemDetails>(
    options: AuthenticatedFetchOptions,
): Promise<FetchResult<T, E>> {
    const { url, scope, headers, method = 'GET', body } = options;

    const oboToken = await getOboTokenFromRequest(headers, scope);

    if (!oboToken.ok) {
        logger.warn({
            message: `Feil ved henting av OBO token for scope ${scope}`,
            error: oboToken.error,
        });
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
                        message: `Feil fra ${url}: ${problemDetails.status} ${problemDetails.title} - ${problemDetails.detail || 'ingen detaljer gitt'}`,
                        httpStatus: problemDetails.status,
                        problemType: problemDetails.type,
                    });
                }
            } catch (_e) {} // Ignore JSON parse errors

            // - Dersom det ikke er RFC 9457, logg generisk error
            if (!isProblemDetails(problemDetails)) {
                logger.error({
                    message: `Feil fra ${url}: ${response.status} ${response.statusText}`,
                    httpStatus: response.status,
                });
            }
            const errorMsg = problemDetails?.detail
                ? `${problemDetails.status} ${problemDetails.title} - ${problemDetails.detail}`
                : `${response.status} ${response.statusText}`;

            return {
                ok: false,
                error: new Error(errorMsg),
                status: response.status,
                problemDetails: (problemDetails ?? undefined) as E | undefined,
            };
        }
        // All good, now parse the ok result
        const text = await response.text();
        const data = text ? (JSON.parse(text) as T) : ({} as T);
        return { ok: true, data };
    } catch (e) {
        const cause = e instanceof Error ? e.message : String(e);
        logger.error(`Fetch mot ${url} kastet exception: ${cause}`);
        return { ok: false, error: new Error(`Fetch failed: ${cause}`, { cause: e }) };
    }
}

export { authenticatedFetch };
