export type ProblemDetails = {
    id: string;
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance: string;
    timestamp?: string;
    [key: string]: unknown; // For custom extensions
};

/**
 * Type guard for å matche et objekt mot RFC 9457 (Problem Details).
 * Brukes for svar fra oppslag-api og bekreftelse-api.
 */
export function isProblemDetails(error: unknown): error is ProblemDetails {
    if (error === null || typeof error !== 'object') return false;
    const obj = error as Record<string, unknown>;
    return (
        typeof obj.id === 'string' &&
        typeof obj.type === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.status === 'number' &&
        typeof obj.instance === 'string'
    );
}
