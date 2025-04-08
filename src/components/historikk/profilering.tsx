import { Profilering } from '@navikt/arbeidssokerregisteret-utils';
import { Box, Heading, BodyShort } from '@navikt/ds-react';

interface Props {
    profilering: Profilering;
}

function ProfileringKomponent(props: Props) {
    const { profilering } = props;
    const { profilertTil, alder, jobbetSammenhengendeSeksAvTolvSisteManeder } = profilering;

    return (
        <Box>
            <Heading size="small" level="3">
                Profilering
            </Heading>
            <hr className="mb-5" />
            <BodyShort className="mb-5">
                <strong>Profilert til</strong>
                <br />
                <span className="block first-letter:uppercase">{profilertTil.split('_').join(' ').toLowerCase()}</span>
            </BodyShort>
            <BodyShort className="mb-5">
                <strong>Jobbet sammenhengende 6 av siste 12 måneder</strong>
                <br />
                {jobbetSammenhengendeSeksAvTolvSisteManeder ? 'Ja' : 'Nei'}
            </BodyShort>
            <BodyShort className="mb-5">
                <strong>Alder</strong>
                <br />
                {alder} år
            </BodyShort>
        </Box>
    );
}

export default ProfileringKomponent;
