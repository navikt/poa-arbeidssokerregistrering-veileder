import { Box, Link } from '@navikt/ds-react';
import { loggAktivitet } from '@/lib/tracking';
import styles from './Forside.module.css';

function TidslinjerLenke() {
    return (
        <Box className={styles.textStart} marginBlock='space-16'>
            <Link href='/tidslinjer' onClick={() => loggAktivitet({ aktivitet: 'Går til tidslinjer' })}>
                Se tidslinjer for arbeidssøkerperioder
            </Link>
        </Box>
    );
}

export { TidslinjerLenke };
