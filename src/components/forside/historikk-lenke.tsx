import { Box, Link } from '@navikt/ds-react';
import { loggAktivitet } from '../../lib/tracking';

function HistorikkLenke() {
    return (
        <Box className="mt-4 mb-4 text-start">
            <Link href="/historikk-v2" onClick={() => loggAktivitet({ aktivitet: 'Går til historikk' })}>
                Se tidligere arbeidssøkerperioder og opplysninger
            </Link>
        </Box>
    );
}

export default HistorikkLenke;
