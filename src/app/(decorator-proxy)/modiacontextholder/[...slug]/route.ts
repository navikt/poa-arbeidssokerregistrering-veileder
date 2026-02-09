import { lagProxyKall } from '../../_lib/proxy-handler';

const handler = lagProxyKall({
	baseUrl: `${process.env.MODIACONTEXTHOLDER_URL}`,
	scope: `api://${process.env.MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID}/.default`,
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
