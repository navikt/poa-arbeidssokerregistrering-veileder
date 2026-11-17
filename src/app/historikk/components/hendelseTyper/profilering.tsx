import type { ProfileringHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyShort, VStack } from '@navikt/ds-react';
import type React from 'react';
import { ReadMoreWrapper } from '@/app/historikk/components/hendelseTyper/read-more-wrapper';

type SporsmalSvar = {
    sporsmal: string;
    svar: string;
};

function formatProfilertTil(profilertTil: string): string {
    const reformat = profilertTil.split('_').join(' ').toLocaleLowerCase();
    const firstToUpperCase = reformat.charAt(0).toUpperCase() + reformat.slice(1).toLowerCase();
    return firstToUpperCase;
}

function mapProfilering(profilering: ProfileringHendelse): SporsmalSvar[] {
    return [
        {
            sporsmal: 'Profilert til',
            svar: formatProfilertTil(profilering.profilertTil),
        },
        {
            sporsmal: 'Jobbet sammenhengende 6 av siste 12 måneder',
            svar: profilering.jobbetSammenhengendeSeksAvTolvSisteMnd ? 'Ja' : 'Nei',
        },
        {
            sporsmal: 'Alder',
            svar: profilering.alder?.toString() || '--',
        },
    ];
}

type ProfileringProps = {
    profilering: ProfileringHendelse;
};

const Profilering: React.FC<ProfileringProps> = (props) => {
    const { profilering } = props;
    const profileringMappet = mapProfilering(profilering);

    return (
        <ReadMoreWrapper header='Se profilering'>
            <VStack gap='space-8'>
                {profileringMappet.map((field) => (
                    <BodyShort key={field.sporsmal}>
                        <strong>{field.sporsmal}</strong>
                        <br />
                        {field.svar}
                    </BodyShort>
                ))}
            </VStack>
        </ReadMoreWrapper>
    );
};

export { Profilering };
