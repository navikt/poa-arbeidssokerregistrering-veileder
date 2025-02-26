import {
    lagHentTekstForSprak,
    mapNusKodeTilUtdannignsnivaa,
    OpplysningerOmArbeidssoker,
    SPORSMAL_TEKSTER,
    SporsmalId,
    Svar,
} from '@navikt/arbeidssokerregisteret-utils';

import { BodyShort, ReadMore } from '@navikt/ds-react';

import Oppfolging from './oppfolging';
import { formaterDato } from '../lib/date-utils';
import OppdaterOpplysningerKnapp from './oppdater-opplysninger-knapp';

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
    aktivPeriode: boolean;
};

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

function OpplysningerOmArbeidssokerKomponent(props: Props) {
    const { opplysninger, behovsvurdering, aktivPeriode } = props;
    const erRegistrertAvSluttbruker = opplysninger.sendtInnAv.utfoertAv.type === 'SLUTTBRUKER';

    return (
        <div className={'flex flex-col'}>
            <BodyShort>
                Opplysningene ble sist oppdatert: {formaterDato(opplysninger.sendtInnAv.tidspunkt)} .
                <br />
                Opplysningene ble oppdatert av: {OPPDATERT_AV[opplysninger.sendtInnAv.utfoertAv.type]}.
            </BodyShort>
            <ReadMore header="Se og oppdater opplysningene">
                <Oppfolging behovsvurdering={behovsvurdering} />
                <OpplysningerKomponent opplysninger={opplysninger} />
                {aktivPeriode && <OppdaterOpplysningerKnapp sisteArbeidssoekerperiodeId={opplysninger.periodeId} />}
            </ReadMore>
        </div>
    );
}

export default OpplysningerOmArbeidssokerKomponent;
