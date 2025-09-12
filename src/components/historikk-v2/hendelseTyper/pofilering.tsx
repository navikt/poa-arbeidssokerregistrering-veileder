import React from 'react';
import { ProfileringV1Hendelse } from '../models/tidslinjer.types';
import { TEKSTER } from '../../tidslinjer/text';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { Box } from '@navikt/ds-react';

type ProfileringProps = {
    profilering: ProfileringV1Hendelse;
};

const Profilering: React.FC<ProfileringProps> = (props) => {
    const { profilering } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <Box as={'p'}>
            <b>Profilering</b>
            {': '}
            {tekst(profilering.profileringV1.profilertTil)}
        </Box>
    );
};

export { Profilering };
