import { Button, Box, ConfirmationPanel } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

function OppdaterOpplysningerKnapp() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { fnr } = params;
    if (!fnr) return null;

    return (
        <Box>
            <Button variant="secondary-neutral" onClick={() => router.push('/oppdater-opplysninger')} className="mb-4">
                Gå til oppdater opplysninger
            </Button>
        </Box>
    );
}

export default OppdaterOpplysningerKnapp;
