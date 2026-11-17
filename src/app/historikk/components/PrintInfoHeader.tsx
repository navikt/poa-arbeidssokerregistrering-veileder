'use client';
import { Box } from '@navikt/ds-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';
import styles from './PrintInfoHeader.module.css';

interface Props {
    fnr: string | null;
}

const PrintInfoHeader = (props: Props) => {
    const [time, setTime] = useState<null | string>(null);

    useEffect(() => {
        const now = prettyPrintDatoOgKlokkeslett(new Date().toISOString(), 'nb', true);
        setTime(now);
    }, []);

    return (
        <Box
            as='section'
            className={`vis-kun-ved-utskrift ${styles.centered}`}
            width='100%'
            marginBlock='space-16 space-32'
        >
            <div>
                <Image src={'/nav-logo.svg'} alt={'Nav Logo'} width={100} height={50} />
            </div>
            <Box marginBlock='space-32 space-16'>Utskriftsdato: {time ?? ' '}</Box>
            <div>Fødselsnummer: {props.fnr || '--'}</div>
        </Box>
    );
};

export default PrintInfoHeader;
