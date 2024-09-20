import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';

import { withAuthenticatedApi } from '../../auth/withAuthentication';

async function yrkeMedStyrk(req: NextApiRequest, res: NextApiResponse<string>) {
    const callId = nanoid();
    const yrke = req.query.yrke;
    const url = `${process.env.PAM_ONTOLOGI_URL}/typeahead/stilling?stillingstittel=${yrke}`;
    const response = await fetch(url, {
        headers: {
            'Nav-Consumer-Id': 'poa-arbeidssokerregistrering-veileder',
            'Nav-Call-Id': callId,
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    res.status(200).json(json);
}

export default withAuthenticatedApi(yrkeMedStyrk);
