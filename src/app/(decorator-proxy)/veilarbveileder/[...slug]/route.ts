import { lagProxyKall } from '../../_lib/proxy-handler';

const handler = lagProxyKall({
	baseUrl: `${process.env.VEILARBVEILEDER_URL}`,
	scope: `api://${process.env.NAIS_CLUSTER_NAME}.obo.veilarbveileder/.default`,
});

export const GET = handler;
export const POST = handler;
