import { lagProxyKall } from '../../_lib/proxy-handler';

const handler = lagProxyKall({
	baseUrl: `${process.env.VEILARBOPPFOLGING_URL}`,
	scope: `api://${process.env.NAIS_CLUSTER_NAME}.poao.veilarboppfolging/.default`,
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
