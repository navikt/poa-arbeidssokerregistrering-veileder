import { lagProxyKall } from '../../_lib/proxy-handler';

const handler = lagProxyKall({
	baseUrl: `${process.env.VEILARBDIALOG_URL}`,
	scope: `api://${process.env.NAIS_CLUSTER_NAME}.dab.veilarbdialog/.default`,
});

export const GET = handler;
export const POST = handler;
