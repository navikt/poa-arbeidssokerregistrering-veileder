import { mapNusKodeTilUtdannignsnivaa, SporsmalId, type Svar } from '@navikt/arbeidssokerregisteret-utils';
import type { OpplysningerHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type OpplysningProps = { sporsmal: string; svar: Svar | string };

function getDinSituasjonSvar(opplysninger?: OpplysningerHendelse) {
    if (!opplysninger?.jobbsituasjon) return 'Ikke oppgitt';
    const situasjon = opplysninger.jobbsituasjon.beskrivelser[0];
    return situasjon?.beskrivelse || 'Ikke oppgitt';
}
function getSisteStillingSvar(opplysninger: OpplysningerHendelse) {
    if (!opplysninger?.jobbsituasjon) return 'Ikke oppgitt';
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
export function mapOpplysningerV2(opplysninger: OpplysningerHendelse): OpplysningProps[] {
    const EMPTY_MSG = 'Mangler opplysninger';
    const result: OpplysningProps[] = [
        {
            sporsmal: SporsmalId.dinSituasjon,
            svar: getDinSituasjonSvar(opplysninger),
        },
        {
            sporsmal: SporsmalId.utdanning,
            svar: opplysninger.utdanning?.nus ? mapNusKodeTilUtdannignsnivaa(opplysninger.utdanning.nus) : EMPTY_MSG,
        },
        {
            sporsmal: SporsmalId.utdanningBestatt,
            svar: opplysninger.utdanning?.bestaatt || EMPTY_MSG,
        },
        {
            sporsmal: SporsmalId.andreForhold,
            svar: opplysninger.annet?.andreForholdHindrerArbeid || EMPTY_MSG,
        },
        {
            sporsmal: SporsmalId.sisteStilling,
            svar: getSisteStillingSvar(opplysninger),
        },
        {
            sporsmal: SporsmalId.utdanningGodkjent,
            svar: opplysninger.utdanning?.godkjent || EMPTY_MSG,
        },
        {
            sporsmal: SporsmalId.helseHinder,
            svar: opplysninger.helse?.helsetilstandHindrerArbeid || EMPTY_MSG,
        },
    ];

    return result;
}
