import { ChevronRightIcon } from '@navikt/aksel-icons';
import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { HStack } from '@navikt/ds-react';
import type React from 'react';
import { getFormatedDateString } from '@/app/historikk/components/helpers';
import styles from './Historikk.module.css';

type HistorikkListeTittelProps = {
    periode: Periode;
};

const HistorikkListeTittel: React.FC<HistorikkListeTittelProps> = (props) => {
    const { periode } = props;

    const handleClick = () => {
        // Scroll to the corresponding section
        const targetElement = document.getElementById(periode.periodeId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <HStack
            as='button'
            data-nav-target={periode.periodeId}
            className={styles.periodeKnapp}
            width='100%'
            padding={{ xs: 'space-8', md: 'space-16' }}
            marginBlock={{ xs: 'space-0', md: 'space-0 space-8' }}
            gap='space-8'
            align='center'
            justify='space-between'
            type='button'
            onClick={handleClick}
        >
            <h2
                className={styles.periodeTittel}
            >{`${getFormatedDateString(periode.startet) || '--'} - ${getFormatedDateString(periode.avsluttet) || 'Pågående'}`}</h2>
            <ChevronRightIcon fontSize='1.5rem' aria-hidden />
        </HStack>
    );
};

export { HistorikkListeTittel };
