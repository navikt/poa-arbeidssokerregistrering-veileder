import {
    mapNusKodeTilUtdannignsnivaa,
    OpplysningerOmArbeidssokerTidslinjer,
    SporsmalId,
    Svar,
} from '@navikt/arbeidssokerregisteret-utils';

type OpplysningProps = { sporsmal: string; svar: Svar | string };

function getDinSituasjonSvar(opplysninger: OpplysningerOmArbeidssokerTidslinjer) {
    const situasjon = opplysninger.jobbsituasjon.beskrivelser?.[0];
    return situasjon?.beskrivelse || 'Ikke oppgitt';
}
function getSisteStillingSvar(opplysninger: OpplysningerOmArbeidssokerTidslinjer) {
    const detaljer = opplysninger.jobbsituasjon.beskrivelser?.[0]?.detaljer;
    return detaljer?.stilling || 'Ikke oppgitt';
}

/**
 * Mapper om data fra tidslinje-api til et format som kan brukes i UI.
 *
 * @param opplysninger - Data fra Tidslinje-api'et
 * @returns En liste med objekter, hver med en spørsmål-identifikator og det tilhørende svaret,
 *          egnet for visning i frontend.
 */
export function mapOpplysningerV2(opplysninger: OpplysningerOmArbeidssokerTidslinjer): OpplysningProps[] {
    const result: OpplysningProps[] = [
        {
            sporsmal: SporsmalId.dinSituasjon,
            svar: getDinSituasjonSvar(opplysninger),
        },
        {
            sporsmal: SporsmalId.utdanning,
            svar: mapNusKodeTilUtdannignsnivaa(opplysninger.utdanning.nus),
        },
        {
            sporsmal: SporsmalId.utdanningBestatt,
            svar: opplysninger.utdanning.bestaatt,
        },
        {
            sporsmal: SporsmalId.andreForhold,
            svar: opplysninger.annet?.andreForholdHindrerArbeid || 'Mangler opplysninger',
        },
        {
            sporsmal: SporsmalId.sisteStilling,
            svar: getSisteStillingSvar(opplysninger),
        },
        {
            sporsmal: SporsmalId.utdanningGodkjent,
            svar: opplysninger.utdanning.godkjent,
        },
        {
            sporsmal: SporsmalId.helseHinder,
            svar: opplysninger.helse?.helsetilstandHindrerArbeid || 'Mangler opplysninger',
        },
    ];

    return result;
}
