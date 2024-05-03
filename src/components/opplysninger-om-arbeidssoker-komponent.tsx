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

const Opplysning = (props: OpplysningProps & { sprak: any }) => {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, props.sprak);
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

function mapOpplysninger(opplysninger: OpplysningerOmArbeidssoker, sprak: any): OpplysningProps[] {
    const result: OpplysningProps[] = [
        {
            sporsmal: SporsmalId.dinSituasjon,
            svar: opplysninger.jobbsituasjon[0].beskrivelse,
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

type Props = {
    opplysninger: OpplysningerOmArbeidssoker;
    sprak: any;
    //behovsvurdering: any;
};

function OpplysningerOmArbeidssokerKomponent(props: Props) {
    const { opplysninger, sprak } = props;
    const erRegistrertAvSluttbruker = opplysninger.sendtInnAv.utfoertAv.type === 'SLUTTBRUKER';
    const besvarelser = mapOpplysninger(opplysninger, sprak);

    return (
        <div className={'flex flex-col'}>
            <div className={'mb-5'}>
                <BodyShort>
                    Opplysningene ble sist oppdatert: {formaterDato(opplysninger.sendtInnAv.tidspunkt)} .
                    <br />
                    Opplysningene ble oppdatert av: {OPPDATERT_AV[opplysninger.sendtInnAv.utfoertAv.type]}.
                </BodyShort>
            </div>
            {/*<Oppfolging sprak={sprak} behovsvurdering={behovsvurdering} />*/}
            {besvarelser.map((item, index) => (
                <Opplysning {...item} key={index} sprak={props.sprak} />
            ))}
        </div>
    );
}

export default OpplysningerOmArbeidssokerKomponent;
