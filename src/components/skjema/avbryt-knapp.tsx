import { Button } from '@navikt/ds-react';
import React from 'react';
import { useRouter } from 'next/router';

const AvbrytKnapp = () => {
    const router = useRouter();
    return (
        <Button
            variant="secondary"
            onClick={() => {
                router.push('/');
            }}
        >
            Avbryt
        </Button>
    );
};
export default AvbrytKnapp;
