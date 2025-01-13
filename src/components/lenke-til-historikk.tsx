import { Box, Link } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';

import { loggAktivitet } from '../lib/amplitude';

function LenkeTilHistorikk() {
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;

    if (fnr === undefined) {
        return null;
    }

    return (
        <Box className="mt-4 mb-4 text-end">
            <Link href="/historikk" onClick={() => loggAktivitet({ aktivitet: 'Går til historikk' })}>
                Se tidligere arbeidssøkerperioder og opplysninger
            </Link>
        </Box>
    );
}

export default LenkeTilHistorikk;
