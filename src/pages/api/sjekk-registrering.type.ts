import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../auth/withAuthentication';

async function sjekkRegistreringType(req: NextApiRequest, res: NextApiResponse<string>) {
    const { fnr } = req.body.fnr;
    const url = `${process.env.START_REGISTRERING_URL}?fnr=${fnr}`;
    const response = await fetch(url);
    const json = await response.json();
    res.status(200).json(json);
}

export default withAuthenticatedApi(sjekkRegistreringType);
