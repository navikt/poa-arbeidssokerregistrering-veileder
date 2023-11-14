import { Alert, BodyLong, GuidePanel, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { TilbakeIArbeid } from '../../model/sporsmal';

const TEKSTER: Tekster<string> = {
    nb: {
        infoTekst:
            'På spørsmål om hva du mener er din fremtidige situasjon, har du svart at du skal tilbake i full jobb før du har vært sykmeldt i 52 uker.',
        tittel: 'Fordi du skal tilbake i full jobb innen 52 uker',
        punkt1: 'har du ikke rett til videre økonomisk støtte fra NAV etter at du er tilbake i jobb',
        punkt2: 'tror vi ikke du trenger mer veiledning fra NAV i tillegg til det du allerede har fått og får i dag',
        infoVarsel: 'Hvis situasjonen din endrer seg, er det viktig at du tar kontakt med veilederen din.',
        enigTittel: 'Er du enig i NAV sin vurdering over?',
        enig: 'Enig',
        uenig: 'Uenig, jeg trenger mer veiledning',
    },
};
const SkalTilbakeTilJobb = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { registrering } = useSykmeldtoppfolging();

    const { tilbakeIArbeid } = registrering;

    if (![TilbakeIArbeid.JA_FULL_STILLING].includes(tilbakeIArbeid as TilbakeIArbeid)) {
        return null;
    }

    return (
        <div>
            <GuidePanel poster className="mbxl">
                <BodyLong className="mbm ">{tekst('infoTekst')}</BodyLong>
                <section>
                    <Heading level="2" size="small">
                        {tekst('tittel')}
                    </Heading>
                    <ul className="listSpacing">
                        <li>{tekst('punkt1')}</li>
                        <li>{tekst('punkt2')}</li>
                    </ul>
                </section>
                <Alert variant="info" inline={true}>
                    {tekst('infoVarsel')}
                </Alert>
            </GuidePanel>

            <Heading level="1" size="small" className="mbm text-center">
                {tekst('enigTittel')}
            </Heading>
        </div>
    );
};

export default SkalTilbakeTilJobb;
