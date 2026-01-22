import { Box, Link } from '@navikt/ds-react';
import { loggAktivitet } from '../../lib/tracking';

function TidslinjerLenke() {
    return (
        <Box className="mt-4 mb-4 text-start">
            <Link href="/tidslinjer" onClick={() => loggAktivitet({ aktivitet: 'Går til tidslinjer' })}>
                Se tidslinjer for arbeidssøkerperioder
            </Link>
        </Box>
    );
}

export default TidslinjerLenke;
