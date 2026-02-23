import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/app/lib/auth/validateToken';
import { logger } from '@navikt/next-logger';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

export async function proxy(request: NextRequest) {
    if (brukerMock) {
        return NextResponse.next();
    }

    // Extract headers
    const bearerToken = request.headers.get('authorization');

    // Validate bearer token (azure)
    const tokenValidationResult = await validateToken(bearerToken);

    if (tokenValidationResult.ok === false) {
        logger.error(
            new Error(`Invalid JWT token found (cause: ${tokenValidationResult.errorType}), redirecting to login.`, {
                cause: tokenValidationResult.error,
            }),
        );
        const selfUrl = process.env.NEXT_PUBLIC_SELF_URL || request.nextUrl.origin;
        const loginUrl = new URL(`/oauth2/login`, request.url);
        loginUrl.searchParams.set('redirect', selfUrl);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/tidslinjer/:path*', '/historikk/:path*'],
};
