import React from 'react';
import { ProfileringV1Hendelse } from '../tidslinjer.types';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../../lib/date-utils';
import opplysninger from '../../forside/opplysninger';
import { TEKSTER } from '../../tidslinjer/text';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { Box, Tooltip } from '@navikt/ds-react';
import { DatabaseIcon } from '@navikt/aksel-icons';
import { HistorikkInnslagHeader } from '../historikk-innslag-header';

type ProfileringProps = {
    profilering: ProfileringV1Hendelse;
};

const Profilering: React.FC<ProfileringProps> = (props) => {
    const { profilering } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <div>
            <HistorikkInnslagHeader
                date={profilering.tidspunkt}
                title={profilering.hendelseType}
                source={profilering.profileringV1.sendtInnAv.utfoertAv.type}
            />
            <Box as={'p'}>
                <b>Profilering</b>
                {': '}
                {tekst(profilering.profileringV1.profilertTil)}
            </Box>
        </div>
    );
};

export { Profilering };
