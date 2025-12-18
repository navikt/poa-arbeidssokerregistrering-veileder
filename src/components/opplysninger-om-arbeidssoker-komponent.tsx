import {
    lagHentTekstForSprak,
    mapNusKodeTilUtdannignsnivaa,
    OpplysningerOmArbeidssoker,
    SPORSMAL_TEKSTER,
    SporsmalId,
    Svar,
} from '@navikt/arbeidssokerregisteret-utils';

import { BodyShort } from '@navikt/ds-react';

type OpplysningProps = { sporsmal: string; svar: Svar | string };

const Opplysning = (props: OpplysningProps) => {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');
    const { sporsmal, svar } = props;
    return (
        <div className={'mb-5'}>
            <BodyShort>
                <strong>{tekst(sporsmal)}</strong>
                <br />
                {tekst(svar as string) ?? svar}
            </BodyShort>
        </div>
    );
};

function getSisteStillingSvar(opplysninger: OpplysningerOmArbeidssoker) {
    const detaljer = opplysninger.jobbsituasjon[0]?.detaljer;
    return detaljer?.stilling || 'Ikke oppgitt';
}

function getDinSituasjonSvar(opplysninger: OpplysningerOmArbeidssoker) {
    const situasjon = opplysninger.jobbsituasjon[0];
    return situasjon ? situasjon.beskrivelse : 'Ikke oppgitt';
}

export function mapOpplysninger(opplysninger: OpplysningerOmArbeidssoker): OpplysningProps[] {
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

export function OpplysningerKomponent(props: { opplysninger: OpplysningerOmArbeidssoker }) {
    const { opplysninger } = props;
    const besvarelser = mapOpplysninger(opplysninger);

    return (
        <>
            {besvarelser.map((item, index) => (
                <Opplysning {...item} key={index} />
            ))}
        </>
    );
}
