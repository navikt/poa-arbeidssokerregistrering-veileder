import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { getHeaders, getTokenFromRequest, getVeilarbregistreringToken } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';
import { logger } from '@navikt/next-logger';

const url = `${process.env.SISTE_ARBEIDSFORHOLD_URL}`;
const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
const sisteArbeidsforhold = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const callId = nanoid();

    try {
        const { fnr } = req.query;
        if (!fnr) {
            return res.status(400).send('mangler fnr');
        }

        const headers = brukerMock
            ? getHeaders('token', callId)
            : getHeaders(await getVeilarbregistreringToken(req), callId);
        logger.info(`Starter kall callId: ${callId} mot ${url}`);
        const { styrk } = await fetch(`${url}?fnr=${fnr}`, {
            headers,
        }).then((res) => res.json());
        logger.info(`Kall med callId: ${callId} mot ${url} ferdig`);
        const pamJanzzUrl = `${process.env.PAM_JANZZ_URL}/kryssklassifiserMedKonsept?kodeForOversetting=${styrk}`;
        logger.info(`Starter kall callId: ${callId} mot ${pamJanzzUrl}`);
        const { konseptMedStyrk08List } = await fetch(pamJanzzUrl, {
            headers,
        }).then((res) => res.json());
        logger.info(`Kall med callId: ${callId} mot ${pamJanzzUrl} ferdig`);
        res.json(konseptMedStyrk08List[0]);
    } catch (e) {
        logger.error(`Kall med (callId: ${callId}) feilet. Feilmelding: ${e}`);
        res.status(500).end(`${e}`);
    }
};

export default withAuthenticatedApi(sisteArbeidsforhold);
