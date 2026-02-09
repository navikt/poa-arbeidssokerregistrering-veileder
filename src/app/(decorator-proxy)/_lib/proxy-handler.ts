import 'server-only';
import { logger } from '@navikt/next-logger';
import { requestAzureOboToken, validateAzureToken } from '@navikt/oasis';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { hentModiaHeaders } from '../../lib/modia-headers';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

function lagProxyKall({ baseUrl, scope }: { baseUrl: string; scope: string }) {
	return async (request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) => {
		if (brukerMock) {
			logger.info('Mock modus aktiv – proxy-kall blir ikke utført');
			return NextResponse.json({ message: 'Mock modus aktiv, proxy deaktivert' }, { status: 200 });
		}

		const headersList = await headers();
		const callId = headersList.get('x-trace-id') ?? nanoid();
		const bearerToken = headersList.get('authorization');

		if (!bearerToken) {
			return NextResponse.json({ message: 'Access denied' }, { status: 401 });
		}

		// 1. Valider brukers token
		const validated = await validateAzureToken(bearerToken);
		if (!validated.ok) {
			logger.error(`AzureToken ble ikke validert`);
			return NextResponse.json({ message: 'Access denied' }, { status: 401 });
		}

		// 2. Hent OBO token
		let oboToken = 'mock';
		const tokenUtenBearer = bearerToken.replace('Bearer ', '');
		const oboResult = await requestAzureOboToken(tokenUtenBearer, scope);

		if (!oboResult.ok) {
			logger.error(`OBO token ble ikke hentet`);
			return NextResponse.json({ message: 'Klarte ikke å hente obo token' }, { status: 500 });
		}
		oboToken = oboResult.token;

		// 3. Bygg url
		const { slug } = await params;
		const slugPath = slug.join('/');
		const queryString = request.nextUrl.searchParams.toString();
		const targetUrl = `${baseUrl}/${slugPath}${queryString ? `?${queryString}` : ''}`;

		// 4. send av gårde
		logger.info(`Proxying ${request.method} to ${targetUrl}`);

		try {
			const response = await fetch(targetUrl, {
				method: request.method,
				// body: request.method === 'POST' ? JSON.stringify(request.body) : null,
				// AI-varianten under blir brukt nå, "noraml" variant over.
				body: request.method === 'POST' ? await request.text() : null,
				headers: hentModiaHeaders(oboToken, callId),
			});

			if (!response.ok) {
				logger.warn(`Proxy failed: ${response.status} - ${targetUrl}`);
			}

			const contentType = response.headers.get('content-type');
			if (contentType?.includes('application/json')) {
				try {
					return NextResponse.json(await response.json(), { status: response.status });
				} catch (jsonError) {
					logger.error(`Kunne ikke parse JSON fra ${targetUrl}: ${jsonError}`);
					return new NextResponse(null, { status: response.status });
				}
			}

			return new NextResponse(null, { status: response.status });
		} catch (error) {
			logger.error(`Fetch til ${targetUrl} feilet: ${error}`);
			return NextResponse.json({ message: 'Proxy request feilet', callId }, { status: 502 });
		}
	};
}

export { lagProxyKall };
