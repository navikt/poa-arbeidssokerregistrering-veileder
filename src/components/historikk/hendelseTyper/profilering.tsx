import React from 'react';
import { ReadMoreWrapper } from './read-more-wrapper';
import { ProfileringHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

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
            svar: profilering.alder.toString(),
        },
    ];
}

type ProfileringProps = {
    profilering: ProfileringHendelse
};

const Profilering: React.FC<ProfileringProps> = (props) => {
    const { profilering } = props;
    const profileringMappet = mapProfilering(profilering);

    return (
        <ReadMoreWrapper header="Se profilering">
            <div className="text-base">
                {profileringMappet.map((field, i) => (
                    <div key={i} className="mb-2">
                        <strong>{field.sporsmal}</strong>
                        <br />
                        {field.svar}
                    </div>
                ))}
            </div>
        </ReadMoreWrapper>
    );
};

export { Profilering };
