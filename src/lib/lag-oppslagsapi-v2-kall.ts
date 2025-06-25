import lagApiHandlerMedAuthHeaders, { ApiHandlerOpts, getOppslagsAPIV2Token } from './next-api-handler';
import { NextApiHandler } from 'next';

type LagOppslagsApiV2Kall = (url: string, opts: ApiHandlerOpts) => NextApiHandler;
const lagOppslagsApiV2Kall: LagOppslagsApiV2Kall = (url, opts) =>
    lagApiHandlerMedAuthHeaders(url, getOppslagsAPIV2Token, opts);

export default lagOppslagsApiV2Kall;
