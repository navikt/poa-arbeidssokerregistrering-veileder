import { Box, Link } from '@navikt/ds-react';
import { loggAktivitet } from '../../lib/amplitude';

function TidslinjerLenke() {
    return (
        <Box className="fixed bottom-0 right-10 print:hidden">
            <Link href="/tidslinjer" onClick={() => loggAktivitet({ aktivitet: 'Går til tidslinjer' })}>
                π
            </Link>
        </Box>
    );
}

export default TidslinjerLenke;
