import React from 'react';
import { TEKSTER } from '../../tidslinjer/text';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { Box } from '@navikt/ds-react';
import { Hendelse } from '../../../model/schema-api.types';

type ProfileringProps = {
    profilering: Hendelse['profilering_v1'];
};

const Profilering: React.FC<ProfileringProps> = (props) => {
    const { profilering } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <Box as={'p'}>
            <b>Profilering</b>
            {': '}
            {tekst(profilering.profilertTil)}
        </Box>
    );
};

export { Profilering };
