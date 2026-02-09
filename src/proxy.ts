import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from './app/lib/auth/validateToken';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const LOGIN_URL = `/oauth2/login?redirect=${process.env.NEXT_PUBLIC_SELF_URL}`;

export async function proxy(request: NextRequest) {
    if (brukerMock) {
        return NextResponse.next();
    }

    // Extract headers
    const bearerToken = request.headers.get('authorization');

    // Validate bearer token (azure)
    const tokenValidationResult = await validateToken(bearerToken);

    if (!tokenValidationResult.ok) {
        // TODO: logg error
        // return NextResponse.redirect(new URL(LOGIN_URL));
        const selfUrl = process.env.NEXT_PUBLIC_SELF_URL || request.nextUrl.origin;
        const loginUrl = new URL(`/oauth2/login`, request.url);
        loginUrl.searchParams.set('redirect', selfUrl);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/tidslinjer/:path*'],
};
