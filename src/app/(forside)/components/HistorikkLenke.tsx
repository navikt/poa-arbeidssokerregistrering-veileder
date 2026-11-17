import { Box, Link } from '@navikt/ds-react';
import { loggAktivitet } from '@/lib/tracking';

function HistorikkLenke() {
    return (
        <Box marginBlock='space-16'>
            <Link href='/historikk' onClick={() => loggAktivitet({ aktivitet: 'Går til historikk' })}>
                Se tidligere arbeidssøkerperioder og opplysninger
            </Link>
        </Box>
    );
}

export { HistorikkLenke };
