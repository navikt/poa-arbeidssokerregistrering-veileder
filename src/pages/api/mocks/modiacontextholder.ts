import { NextApiRequest, NextApiResponse } from 'next';

const modiacontextholder = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({
        ident: 'Z994381',
        navn: 'F_Z994381 E_Z994381',
        fornavn: 'F_Z994381',
        etternavn: 'E_Z994381',
        aktivBruker: null,
        aktivEnhet: '0123',
        enheter: [
            { enhetId: '0219', navn: 'NAV Bærum' },
            { enhetId: '0501', navn: 'NAV Lillehammer-Gausdal' },
            { enhetId: '0123', navn: 'NAV Dalane' },
        ],
    });
};

export default modiacontextholder;
