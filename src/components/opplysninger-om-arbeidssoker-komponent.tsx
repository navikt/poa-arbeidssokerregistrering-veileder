import {
    lagHentTekstForSprak,
    mapNusKodeTilUtdannignsnivaa,
    OpplysningerOmArbeidssoker,
    SPORSMAL_TEKSTER,
    SporsmalId,
    Svar,
} from '@navikt/arbeidssokerregisteret-utils';
import { BodyShort } from '@navikt/ds-react';

import Oppfolging from './oppfolging';

import { formaterDato } from '../lib/date-utils';
import { ArbeidssokerPeriode } from '@navikt/arbeidssokerregisteret-utils/dist/models/arbeidssokerperiode';
//import { BehovsvurderingResponse } from '../../contexts/behovsvurdering';

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

function mapOpplysninger(opplysninger: OpplysningerOmArbeidssoker): OpplysningProps[] {
    const result: OpplysningProps[] = [
        {
            sporsmal: SporsmalId.dinSituasjon,
            svar: opplysninger.jobbsituasjon[0]?.beskrivelse || 'Ingen svar',
        },
        {
            sporsmal: SporsmalId.sisteStilling,
            svar: getSisteStillingSvar(opplysninger),
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
            sporsmal: SporsmalId.utdanningGodkjent,
            svar: opplysninger.utdanning.godkjent,
        },
        {
            sporsmal: SporsmalId.helseHinder,
            svar: opplysninger.helse.helsetilstandHindrerArbeid,
        },
        {
            sporsmal: SporsmalId.andreForhold,
            svar: opplysninger.annet.andreForholdHindrerArbeid,
        },
    ];

    return result;
}

const OPPDATERT_AV = {
    UKJENT_VERDI: 'Ukjent',
    SLUTTBRUKER: 'Sluttbruker',
    UDEFINERT: 'Ukjent',
    VEILEDER: 'Veileder',
    SYSTEM: 'Systembruker',
};
export enum ForeslattInnsatsgruppe {
    STANDARD_INNSATS = 'STANDARD_INNSATS',
    SITUASJONSBESTEMT_INNSATS = 'SITUASJONSBESTEMT_INNSATS',
    BEHOV_FOR_ARBEIDSEVNEVURDERING = 'BEHOV_FOR_ARBEIDSEVNEVURDERING',
}
export type BehovsvurderingResponse = {
    dato?: string;
    oppfolging: ForeslattInnsatsgruppe;
    dialogId?: string;
    profileringId?: string;
} | null;

type Props = {
    opplysninger: OpplysningerOmArbeidssoker;
    behovsvurdering: BehovsvurderingResponse;
};

function OpplysningerOmArbeidssokerKomponent(props: Props) {
    const { opplysninger, behovsvurdering } = props;
    const erRegistrertAvSluttbruker = opplysninger.sendtInnAv.utfoertAv.type === 'SLUTTBRUKER';
    const besvarelser = mapOpplysninger(opplysninger);
    return (
        <div className={'flex flex-col'}>
            <div className={'mb-5'}>
                <BodyShort>
                    Opplysningene ble sist oppdatert: {formaterDato(opplysninger.sendtInnAv.tidspunkt)} .
                    <br />
                    Opplysningene ble oppdatert av: {OPPDATERT_AV[opplysninger.sendtInnAv.utfoertAv.type]}.
                </BodyShort>
            </div>
            <Oppfolging behovsvurdering={behovsvurdering} />
            {besvarelser.map((item, index) => (
                <Opplysning {...item} key={index} />
            ))}
        </div>
    );
}

export default OpplysningerOmArbeidssokerKomponent;
