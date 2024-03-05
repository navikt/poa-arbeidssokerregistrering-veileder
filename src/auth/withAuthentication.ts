import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@navikt/next-logger';
import { validateAzureToken } from '@navikt/oasis';

type PageHandler = (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<unknown>>;
type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<unknown> | unknown;

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

/**
 * Used to authenticate Next.JS pages. Assumes application is behind
 * Wonderwall (https://doc.nais.io/security/auth/idporten/sidecar/). Will automatically redirect to login if
 * Wonderwall-cookie is missing.
 *
 */
export function withAuthenticatedPage(handler: PageHandler = async () => ({ props: {} })) {
    return async function withBearerTokenHandler(
        context: GetServerSidePropsContext,
    ): Promise<ReturnType<NonNullable<typeof handler>>> {
        if (brukerMock) {
            return handler(context);
        }

        const request = context.req;

        const bearerToken: string | null | undefined = request.headers['authorization'];
        if (!bearerToken) {
            return {
                redirect: {
                    destination: `/oauth2/login?redirect=${process.env.NEXT_PUBLIC_SELF_URL}`,
                    permanent: false,
                },
            };
        }

        const validationResult = await validateAzureToken(bearerToken);
        if (validationResult.ok === false) {
            logger.error(
                new Error(`Invalid JWT token found (cause: ${validationResult.errorType}), redirecting to login.`, {
                    cause: validationResult.error,
                }),
            );
            return {
                redirect: {
                    destination: `/oauth2/login?redirect=${process.env.NEXT_PUBLIC_SELF_URL}`,
                    permanent: false,
                },
            };
        }

        return handler(context);
    };
}

export function withAuthenticatedApi(handler: ApiHandler): ApiHandler {
    return async function withBearerTokenHandler(req, res, ...rest) {
        if (brukerMock) {
            return handler(req, res, ...rest);
        }

        const bearerToken: string | null | undefined = req.headers['authorization'];
        const validatedToken = bearerToken ? await validateAzureToken(bearerToken) : null;
        if (!bearerToken || !validatedToken?.ok) {
            if (validatedToken && validatedToken.ok === false) {
                logger.error(`Invalid JWT token found (cause: ${validatedToken.errorType} for API ${req.url}`);
            }

            res.status(401).json({ message: 'Access denied' });
            return;
        }

        return handler(req, res, ...rest);
    };
}
