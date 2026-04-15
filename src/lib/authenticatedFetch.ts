import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import { getOboTokenFromRequest } from '@/lib/auth/oboToken';
import { hentModiaHeaders } from '@/lib/modia-headers';
import { isProblemDetails, type ProblemDetails } from '@/model/problem-details';

// --- BackendError discriminated union ---
// Backends i dette prosjektet returnerer to ulike feilformater:
//   - FeilV2: brukt av inngang-api (api-start-stopp-perioder)
//   - ProblemDetails (RFC 9457): brukt av bekreftelse-api og oppslag-api

export type FeilV2Shape = { feilKode: string; melding: string };

export function isFeilV2(value: unknown): value is FeilV2Shape {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
    const obj = value as Record<string, unknown>;
    return typeof obj.feilKode === 'string' && typeof obj.melding === 'string';
}

export type BackendError =
    | { kind: 'feilV2'; feilKode: string; melding: string; rawBody: FeilV2Shape }
    | { kind: 'problemDetails'; problemDetails: ProblemDetails }
    | { kind: 'ukjent'; rawBody: unknown };

function classifyError(json: unknown): BackendError {
    if (isProblemDetails(json)) {
        return { kind: 'problemDetails', problemDetails: json };
    }
    if (isFeilV2(json)) {
        return { kind: 'feilV2', feilKode: json.feilKode, melding: json.melding, rawBody: json };
    }
    return { kind: 'ukjent', rawBody: json };
}

// --- Result types ---

type FetchSuccess<T> = { ok: true; data: T };
type FetchFailure = {
    ok: false;
    error: Error;
    status?: number;
    backendError?: BackendError;
};
type FetchResult<T> = FetchSuccess<T> | FetchFailure;

type AuthenticatedFetchOptions = {
    url: string;
    scope: string;
    headers: Headers;
    method?: 'GET' | 'POST' | 'PUT';
    body?: unknown;
    extraHeaders?: Record<string, string>;
    // HTTP-statuskoder som er forventet og ikke skal logges som feil.
    // Kalleren tar ansvar for logging av disse statusene.
    suppressLogForStatuses?: number[];
};

async function authenticatedFetch<T>(options: AuthenticatedFetchOptions): Promise<FetchResult<T>> {
    const { url, scope, headers, method = 'GET', body, extraHeaders, suppressLogForStatuses = [] } = options;

    const traceId = headers.get('x-trace-id') ?? nanoid();
    const oboToken = await getOboTokenFromRequest(headers, scope);

    if (!oboToken.ok) {
        logger.warn({
            message: `Feil ved henting av OBO token for scope ${scope}`,
            error: oboToken.error,
            traceId,
        });
        const { error } = oboToken as { ok: false; error: Error };
        return { ok: false, error };
    }

    const modiaHeader = hentModiaHeaders(oboToken.token, traceId);

    try {
        const response = await fetch(url, {
            method,
            body: body ? JSON.stringify(body) : null,
            headers: { ...modiaHeader, ...extraHeaders },
        });

        if (!response.ok) {
            let backendError: BackendError | undefined;
            try {
                backendError = classifyError(await response.json());
            } catch (_e) {
                // Ignore — tom body eller ikke JSON
            }

            // 403 logges alltid uavhengig av suppressLogForStatuses — tilgangsfeil er alltid relevante.
            if (response.status === 403) {
                logger.warn({
                    message: `Tilgang nektet fra ${url}: ${response.status} ${response.statusText}`,
                    event: 'tilgang_nektet',
                    httpStatus: 403,
                    feilKode: backendError?.kind === 'feilV2' ? backendError.feilKode : undefined,
                    traceId,
                });
                return {
                    ok: false,
                    error: new Error('Tilgang mangler'),
                    status: 403,
                    backendError,
                };
            }

            if (backendError?.kind === 'problemDetails') {
                const pd = backendError.problemDetails;
                if (!suppressLogForStatuses.includes(response.status)) {
                    logger.error({
                        message: `Feil fra ${url}: ${pd.status} ${pd.title}`,
                        event: 'feilrespons_med_problemdetails',
                        httpStatus: response.status,
                        problemType: pd.type,
                        traceId,
                    });
                }
            } else if (backendError?.kind === 'feilV2') {
                if (!suppressLogForStatuses.includes(response.status)) {
                    logger.error({
                        message: `Feil fra ${url}: ${response.status} ${response.statusText}`,
                        event: 'feilrespons_feilv2',
                        httpStatus: response.status,
                        feilKode: backendError.feilKode,
                        traceId,
                    });
                }
            } else {
                if (!suppressLogForStatuses.includes(response.status)) {
                    logger.error({
                        message: `Feil fra ${url}: ${response.status} ${response.statusText}`,
                        event: 'uventet_feilrespons',
                        httpStatus: response.status,
                        traceId,
                    });
                }
            }

            const errorMsg =
                backendError?.kind === 'problemDetails'
                    ? `${backendError.problemDetails.status} ${backendError.problemDetails.title}`
                    : `${response.status} ${response.statusText}`;

            return {
                ok: false,
                error: new Error(errorMsg),
                status: response.status,
                backendError,
            };
        }

        // All good, parse the success response
        const text = await response.text();
        const data = text ? (JSON.parse(text) as T) : ({} as T);
        return { ok: true, data };
    } catch (e) {
        const cause = e instanceof Error ? e.message : String(e);
        logger.error({
            message: `Fetch mot ${url} kastet exception: ${cause}`,
            event: 'fetch_exception',
            traceId,
        });
        return { ok: false, error: new Error(`Fetch failed: ${cause}`, { cause: e }) };
    }
}

export { authenticatedFetch };
export type { FetchResult, FetchSuccess, FetchFailure, AuthenticatedFetchOptions };
