import { lagProxyKall } from '../../_lib/proxy-handler';

const handler = lagProxyKall({
    baseUrl: `${process.env.VEILARBPERSON_URL}`,
    scope: `api://${process.env.NAIS_CLUSTER_NAME}.obo.veilarbperson/.default`,
});

export const GET = handler;
export const POST = handler;
