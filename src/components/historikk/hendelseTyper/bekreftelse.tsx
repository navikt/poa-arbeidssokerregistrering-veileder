import React from 'react';
import { prettyPrintDato } from '../../../lib/date-utils';
import { ReadMoreWrapper } from './read-more-wrapper';
import { BekreftelseHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type SporsmalSvar = {
    sporsmal: string;
    svar: string;
};

function mapBekreftelse(bekreftelse: BekreftelseHendelse): SporsmalSvar[] {
    if(!bekreftelse?.svar) {
        return [];
    }
    const arr: SporsmalSvar[] = [
        {
            sporsmal: 'Bekreftelse for følgende periode',
            svar: `${prettyPrintDato(bekreftelse.svar.gjelderFra)} - ${prettyPrintDato(bekreftelse.svar.gjelderTil)}`,
        },
        {
            sporsmal: 'Jobbet i perioden',
            svar: bekreftelse.svar.harJobbetIDennePerioden ? 'Ja' : 'Nei',
        },
        {
            sporsmal: 'Vil du fortsatt være arbeidssøker?',
            svar: bekreftelse.svar.vilFortsetteSomArbeidssoeker ? 'Ja' : 'Nei',
        },
    ];
    return arr;
}

type BekreftelseProps = {
    bekreftelse: BekreftelseHendelse
};

const Bekreftelse: React.FC<BekreftelseProps> = (props) => {
    const { bekreftelse } = props;
    const bekreftelseMappet = mapBekreftelse(bekreftelse);

    return (
        <ReadMoreWrapper header="Se bekreftede opplysninger">
            <div className="text-base">
                {bekreftelseMappet.map((field, i) => (
                    <div key={i} className="mb-2">
                        <strong>{field.sporsmal}</strong>
                        <br />
                        {field.svar}
                    </div>
                ))}
            </div>
        </ReadMoreWrapper>
    );
};

export { Bekreftelse };
