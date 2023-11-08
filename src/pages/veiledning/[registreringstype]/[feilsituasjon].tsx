import { useEffect, useState } from 'react';
import { BodyLong, Button, GuidePanel, Heading } from '@navikt/ds-react';

import lagHentTekstForSprak, { Tekster } from '../../../lib/lag-hent-tekst-for-sprak';
import useSprak from '../../../hooks/useSprak';
import { loggStoppsituasjon } from '../../../lib/amplitude';
import { Opprettelsesfeil } from '../../../components/KvitteringOppgave';

import { FeilmeldingGenerell } from '../../../components/feilmeldinger/feilmeldinger';
import { Feiltype, OppgaveRegistreringstype } from '../../../model/feilsituasjonTyper';
import { withAuthenticatedPage } from '../../../auth/withAuthentication';

interface Feilsituasjon {
    oppgaveRegistreringstype?: OppgaveRegistreringstype;
    feiltype?: Feiltype;
}

const TEKSTER: Tekster<string> = {
    nb: {
        heading: 'Personen kan ikke registreres som arbeidssøker',
        utvandretBody1: 'Personen står registrert som utvandret i våre systemer.',
        manglerArbeidstillatelseBody1: 'Vi finner ikke godkjent oppholdstillatelse.',
        servicerutineUtvandret: 'Dette gjør at du ikke kan registrere deg som arbeidssøker på nett.',
        servicerutineOpphold:
            'Det du må gjøre videre er beskrevet i servicerutine for registrering av arbeids- og oppholdstillatelse.',
    },
    en: {
        //TODO: Oversetting
    },
};

const KontaktVeileder = (props: Feilsituasjon) => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const [responseMottatt, settResponseMottatt] = useState<boolean>(false);
    const [feil, settFeil] = useState<Opprettelsesfeil | undefined>(undefined);

    useEffect(() => {
        loggStoppsituasjon({
            situasjon: 'Arbeidssøkeren mangler arbeidstillatelse eller er utvandret',
        });
    }, []);

    if (props.feiltype === undefined || !Object.values(Feiltype).includes(props.feiltype)) {
        return <FeilmeldingGenerell />;
    }

    return (
        <>
            <GuidePanel poster>
                <Heading size="medium" spacing={true} level="1">
                    {tekst('heading')}
                </Heading>
                <BodyLong>
                    {tekst(props.feiltype === Feiltype.UTVANDRET ? 'utvandretBody1' : 'manglerArbeidstillatelseBody1')}
                </BodyLong>
                <BodyLong spacing>{tekst('body2')}</BodyLong>
            </GuidePanel>
        </>
    );
};

export const getServerSideProps = withAuthenticatedPage(async (context) => {
    const { registreringstype, feilsituasjon } = context.query;

    return {
        props: {
            oppgaveRegistreringstype: registreringstype as OppgaveRegistreringstype,
            feiltype: feilsituasjon as Feiltype,
        },
    };
});

export default KontaktVeileder;
