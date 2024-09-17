import lagApiHandlerMedAuthHeaders, { ApiHandlerOpts, getArbeidssoekerregistreringToken } from './next-api-handler';
import { NextApiHandler } from 'next';

type LagArbeidssokerApiKall = (url: string, opts: ApiHandlerOpts) => NextApiHandler;
const lagArbeidssokerApiKall: LagArbeidssokerApiKall = (url, opts) =>
    lagApiHandlerMedAuthHeaders(url, getArbeidssoekerregistreringToken, opts);

export default lagArbeidssokerApiKall;
