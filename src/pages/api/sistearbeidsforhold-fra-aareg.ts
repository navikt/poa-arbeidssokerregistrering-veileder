import { NextApiRequest, NextApiResponse } from 'next';

import { getAaregToken, getHeaders, getTraceIdFromRequest } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';
import { logger } from '@navikt/next-logger';
import { hentSisteArbeidsForhold } from '../../lib/hent-siste-arbeidsforhold';

const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

const url = brukerMock
    ? `${process.env.SISTEARBEIDSFORHOLD_FRA_AAREG_URL}`
    : `${process.env.AAREG_REST_API}/v2/arbeidstaker/arbeidsforholdoversikt`;

const hentFnr = (req: NextApiRequest) => {
    return req.headers['nav-personident'];
};

const getAaregHeaders = async (req: NextApiRequest, callId: string) => {
    if (brukerMock) {
        return {
            ...getHeaders('token', callId),
        };
    }

    const headers = getHeaders(await getAaregToken(req), callId);

    return {
        ...headers,
    };
};
async function hentFraAareg(req: NextApiRequest, callId: string) {
    logger.info(`Starter kall callId: ${callId} mot ${url}`);
    const personIdent = hentFnr(req);
    const body = {
        arbeidstakerId: personIdent,
        arbeidsforholdstatuser: ['AKTIV', 'AVSLUTTET'],
    };

    const arbeidsforholdoversikt = await fetch(`${url}`, {
        headers: await getAaregHeaders(req, callId),
        method: 'POST',
        body: JSON.stringify(body),
    }).then(async (res) => {
        if (!res.ok) {
            logger.error(`Respons fra aareg ikke OK - [callId: ${callId}] ${res.status} ${res.statusText}`);
            throw new Error('Feil ved henting av siste arbeidsforhold');
        }
        return res.json();
    });
    logger.info(`Kall callId: ${callId} mot ${url} er ferdig`);
    return arbeidsforholdoversikt;
}

const sisteArbeidsforhold = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const callId = getTraceIdFromRequest(req);

    try {
        const fnr = hentFnr(req);

        if (!fnr) {
            return res.status(400).send('mangler fnr');
        }

        const { styrk } = hentSisteArbeidsForhold(await hentFraAareg(req, callId));

        if (!styrk) {
            return res.status(204).end();
        }

        logger.info(`Slår opp styrk-kode [callId: ${callId}]`);
        const { konseptMedStyrk08List } = await fetch(
            `${process.env.PAM_JANZZ_URL}/kryssklassifiserMedKonsept?kodeForOversetting=${styrk}`,
            {
                headers: getHeaders('token', callId),
            },
        ).then((res) => res.json());
        logger.info(`Oppslag mot styrk-kode ferdig [callId: ${callId}]`);
        res.json(konseptMedStyrk08List[0]);
    } catch (e) {
        logger.error(`Feil ved oppslag av styrk mot PAM_JANZZ [callId: ${callId}]`, e);
        res.status(500).end(`${e}`);
    }
};

export default withAuthenticatedApi(sisteArbeidsforhold);
