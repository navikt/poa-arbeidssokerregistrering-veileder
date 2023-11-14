import { useEffect } from 'react';
import { BodyLong, Heading, Alert, Link } from '@navikt/ds-react';

import lagHentTekstForSprak, { Tekster } from '../../../lib/lag-hent-tekst-for-sprak';
import useSprak from '../../../hooks/useSprak';
import { loggStoppsituasjon } from '../../../lib/amplitude';

import { FeilmeldingGenerell } from '../../../components/feilmeldinger/feilmeldinger';
import { Feiltype, OppgaveRegistreringstype } from '../../../model/feilsituasjonTyper';
import { withAuthenticatedPage } from '../../../auth/withAuthentication';

interface Feilsituasjon {
    feiltype?: Feiltype;
}

const TEKSTER: Tekster<string> = {
    nb: {
        heading: 'Personen kan ikke registreres som arbeidssøker',
        utvandretBeskrivelse: 'Personen står registrert som utvandret i våre systemer.',
        manglerArbeidstillatelseBeskrivelse: 'Vi finner ikke godkjent oppholdstillatelse.',
        servicerutineIntro: 'Det du må gjøre videre er beskrevet i ',
        servicerutineLenkeUtvandret:
            'https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Registrering-av-arbeids--og-oppholdstillatelse.aspx?web=1',
        servicerutineLenkeTekstUtvandret: 'servicerutine for registrering av arbeids- og oppholdstillatelse',
        servicerutineLenkeArbeidstillatelse:
            'https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Registrering-av-arbeids--og-oppholdstillatelse.aspx?web=1',
        servicerutineLenkeTekstArbeidstillatelse: 'servicerutine for registrering av arbeids- og oppholdstillatelse',
    },
};

const KontaktVeileder = (props: Feilsituasjon) => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

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
            <Alert variant="warning">
                <Heading size="medium" spacing={true} level="1">
                    {tekst('heading')}
                </Heading>
                <BodyLong>
                    {tekst(
                        props.feiltype === Feiltype.UTVANDRET
                            ? 'utvandretBeskrivelse'
                            : 'manglerArbeidstillatelseBeskrivelse',
                    )}
                </BodyLong>
                <BodyLong spacing className="mt-4">
                    {tekst('servicerutineIntro')}{' '}
                    <Link
                        inlineText
                        href={tekst(
                            props.feiltype === Feiltype.UTVANDRET
                                ? 'servicerutineLenkeUtvandret'
                                : 'servicerutineLenkeArbeidstillatelse',
                        )}
                    >
                        {tekst(
                            props.feiltype === Feiltype.UTVANDRET
                                ? 'servicerutineLenkeTekstUtvandret'
                                : 'servicerutineLenkeTekstArbeidstillatelse',
                        )}
                    </Link>
                    .
                </BodyLong>
            </Alert>
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
