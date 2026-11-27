import { getToken, requestAzureOboToken, validateAzureToken } from '@navikt/oasis';

export async function POST(request: Request) {
    const host = process.env.LUMI_API_HOST;
    const audience = process.env.LUMI_AUDIENCE;
    const feedbackPath = process.env.LUMI_FEEDBACK_PATH;
    if (!host || !audience || !feedbackPath) {
        console.error('Lumi-konfigurasjon mangler');
        return new Response(null, { status: 500 });
    }

    const token = getToken(request);
    if (!token) {
        return new Response(null, { status: 401 });
    }

    const validation = await validateAzureToken(token);
    if (!validation.ok) {
        return new Response(null, { status: 401 });
    }

    const obo = await requestAzureOboToken(token, audience);
    if (!obo.ok) {
        console.error('Tokenveksling feilet:', obo.error.message);
        return new Response(null, { status: 500 });
    }

    // transportPayload fra widgeten, sendt videre uendret
    const body = await request.text();

    let response: Response;
    let errorText = '';
    try {
        response = await fetch(`${host}${feedbackPath}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${obo.token}`,
                'Content-Type': 'application/json',
            },
            body,
            // Gi opp før widgeten, som venter i ti sekunder
            signal: AbortSignal.timeout(8_000),
        });
        if (!response.ok) {
            errorText = await response.text();
        }
    } catch (error) {
        const timedOut = error instanceof Error && error.name === 'TimeoutError';
        console.error('Lumi API svarte ikke:', error);
        return new Response(null, { status: timedOut ? 504 : 502 });
    }

    if (!response.ok) {
        console.error(`Lumi API svarte med ${response.status}: ${errorText}`);
    }

    const headers = new Headers();
    const retryAfter = response.headers.get('Retry-After');
    if (retryAfter) {
        headers.set('Retry-After', retryAfter);
    }
    return new Response(null, { status: response.status, headers });
}
