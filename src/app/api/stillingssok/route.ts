import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';

const PAM_ONTOLOGI_URL = process.env.PAM_ONTOLOGI_URL;

type StillingTypeahead = {
    konseptId: number;
    label: string;
    styrk08: string;
};

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query');

    if (!query || query.trim().length === 0) {
        return NextResponse.json([]);
    }

    const callId = nanoid();
    const url = `${PAM_ONTOLOGI_URL}/typeahead/stilling?stillingstittel=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Nav-Consumer-Id': 'poa-arbeidssokerregistrering-veileder',
                'Nav-Call-Id': callId,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            logger.warn(`Stillingssøk feilet: ${response.status} ${response.statusText} (callId: ${callId})`);
            return NextResponse.json([], { status: response.status });
        }

        const data: StillingTypeahead[] = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        logger.error(`Stillingssøk feilet mot PAM ontologi (callId: ${callId}): ${error}`);
        return NextResponse.json([], { status: 502 });
    }
}
