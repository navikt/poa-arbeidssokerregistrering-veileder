import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@navikt/next-logger';

const context = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        logger.info('POST request', req.body);
        return res.status(200).json({});
    } else {
        res.status(200).json({
            ident: 'Z994381',
            navn: 'F_Z994381 E_Z994381',
            fornavn: 'F_Z994381',
            etternavn: 'E_Z994381',
            aktivBruker: '0123456789',
            aktivEnhet: '0123',
            enheter: [
                { enhetId: '0219', navn: 'NAV Bærum' },
                { enhetId: '0501', navn: 'NAV Lillehammer-Gausdal' },
                { enhetId: '0123', navn: 'NAV Dalane' },
            ],
        });
    }
};

export default context;
