import { Profilering as ProfileringType } from '@navikt/arbeidssokerregisteret-utils';
import { Box, ReadMore } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { useVisningTypeContext } from '../../../contexts/hendelse-visning-context';

type SporsmalSvar = {
    sporsmal: string;
    svar: string;
};

function formatProfilertTil(profilertTil: string): string {
    const reformat = profilertTil.split('_').join(' ').toLocaleLowerCase();
    const firstToUpperCase = reformat.charAt(0).toUpperCase() + reformat.slice(1).toLowerCase();
    return firstToUpperCase;
}

function mapProfilering(profilering: ProfileringType): SporsmalSvar[] {
    return [
        {
            sporsmal: 'Profilert til',
            svar: formatProfilertTil(profilering.profilertTil),
        },
        {
            sporsmal: 'Jobbet sammenhengende 6 av siste 12 måneder',
            svar: profilering.jobbetSammenhengendeSeksAvTolvSisteManeder ? 'Ja' : 'Nei',
        },
        {
            sporsmal: 'Alder',
            svar: profilering.alder.toString(),
        },
    ];
}

type ProfileringProps = {
    profilering: ProfileringType;
};

const Profilering: React.FC<ProfileringProps> = (props) => {
    const { profilering } = props;
    const { visningsType } = useVisningTypeContext();
    const [open, setOpen] = useState(false);

    const profileringMappet = mapProfilering(profilering);

    useEffect(() => {
        if (visningsType === 'expanded') {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [visningsType]);
    return (
        <Box>
            <ReadMore header="Se profilering" onOpenChange={() => setOpen(!open)} open={open}>
                <div className="text-base">
                    {profileringMappet.map((field, i) => (
                        <div key={i} className="mb-2">
                            <strong>{field.sporsmal}</strong>
                            <br />
                            {field.svar}
                        </div>
                    ))}
                </div>
            </ReadMore>
        </Box>
    );
};

export { Profilering };
