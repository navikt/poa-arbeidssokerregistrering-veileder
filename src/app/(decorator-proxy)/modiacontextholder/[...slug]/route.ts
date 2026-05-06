import { lagProxyKall } from '../../_lib/proxy-handler';

const proxyHandler = lagProxyKall({
    baseUrl: `${process.env.MODIACONTEXTHOLDER_URL}`,
    scope: `api://${process.env.MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID}/.default`,
});
2;

export const GET = proxyHandler;
export const POST = proxyHandler;
export const DELETE = proxyHandler;
