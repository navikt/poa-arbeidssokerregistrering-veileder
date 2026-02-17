import { lagProxyKall } from '../../_lib/proxy-handler';

const handler = lagProxyKall({
	baseUrl: `${process.env.OBO_UNLEASH_URL}`,
	scope: `api://${process.env.NAIS_CLUSTER_NAME}.obo.obo-unleash/.default`,
});

export const GET = handler;
export const POST = handler;
