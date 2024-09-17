import lagApiHandlerMedAuthHeaders, { ApiHandlerOpts, getOppslagsAPIToken } from './next-api-handler';
import { NextApiHandler } from 'next';

type LagOppslagsApiKall = (url: string, opts: ApiHandlerOpts) => NextApiHandler;
const lagOppslagsApiKall: LagOppslagsApiKall = (url, opts) =>
    lagApiHandlerMedAuthHeaders(url, getOppslagsAPIToken, opts);

export default lagOppslagsApiKall;
