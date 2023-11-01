import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { getHeaders, getVeilarbregistreringToken } from '../../lib/next-api-handler';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

const url = `${process.env.SISTE_ARBEIDSFORHOLD_URL}`;
const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
const sisteArbeidsforhold = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const callId = nanoid();
    const headers = brukerMock
        ? getHeaders('token', callId)
        : getHeaders(await getVeilarbregistreringToken(req), callId);
    try {
        const { styrk } = await fetch(url, {
            headers,
        }).then((res) => res.json());

        const { konseptMedStyrk08List } = await fetch(
            `${process.env.PAM_JANZZ_URL}/kryssklassifiserMedKonsept?kodeForOversetting=${styrk}`,
            {
                headers,
            }
        ).then((res) => res.json());

        res.json(konseptMedStyrk08List[0]);
    } catch (e) {
        res.status(500).end(`${e}`);
    }
};

export default withAuthenticatedApi(sisteArbeidsforhold);
