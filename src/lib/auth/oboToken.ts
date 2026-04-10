import 'server-only';
import { getToken, requestAzureOboToken } from '@navikt/oasis';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { validateToken } from './validateToken';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

type OboTokenSuccess = { ok: true; token: string };
type OboTokenFailure = { ok: false; error: Error };
type OboTokenResult = OboTokenSuccess | OboTokenFailure;

async function getOboTokenFromRequest(headerList: Headers | ReadonlyHeaders, scope: string): Promise<OboTokenResult> {
    if (brukerMock) {
        return {
            ok: true,
            token: 'mocked-token',
        };
    }
    if (!headerList) {
        return {
            ok: false,
            error: new Error('Ingen token funnet'),
        };
    }

    const incommingToken = getToken(headerList);
    if (!incommingToken) {
        return {
            ok: false,
            error: new Error('Ingen token funnet'),
        };
    }
    const validation = await validateToken(incommingToken);
    if (!validation.ok) {
        return {
            ok: false,
            error: new Error('Ugyldig token'),
        };
    }

    const result = await requestAzureOboToken(incommingToken, scope);
    if (!result.ok) {
        return {
            ok: false,
            error: new Error('Autentisering feilet — prøv å laste siden på nytt'),
        };
    }
    return {
        ok: true,
        token: result.token,
    };
}

export { getOboTokenFromRequest };
