import { Bekreftelse as BekreftelseType, Hendelse } from '@navikt/arbeidssokerregisteret-utils';
import { Box, ReadMore } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { prettyPrintDato } from '../../../lib/date-utils';
import { useVisningTypeContext } from '../../../contexts/hendelse-visning-context';

type SporsmalSvar = {
    sporsmal: string;
    svar: string;
};

function mapBekreftelse(bekreftelse: BekreftelseType): SporsmalSvar[] {
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
            sporsmal: 'Vil du fotsatt være arbeidssøker?',
            svar: bekreftelse.svar.vilFortsetteSomArbeidssoeker ? 'Ja' : 'Nei',
        },
    ];
    return arr;
}

type BekreftelseProps = {
    bekreftelse: Hendelse['bekreftelseV1'];
};

const Bekreftelse: React.FC<BekreftelseProps> = (props) => {
    const { bekreftelse } = props;
    const [open, setOpen] = useState(false);
    const { visningsType } = useVisningTypeContext();
    const bekreftelseMappet = mapBekreftelse(bekreftelse.bekreftelse);

    useEffect(() => {
        if (visningsType === 'expanded') {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [visningsType]);

    return (
        <Box>
            <ReadMore header="Se bekreftede opplysninger" onOpenChange={() => setOpen(!open)} open={open}>
                <div className="text-base">
                    {bekreftelseMappet.map((field, i) => (
                        <div key={i} className="mb-2">
                            <strong>{field.sporsmal}</strong>
                            <br />
                            {field.svar}
                        </div>
                    ))}
                </div>
            </ReadMore>
        </Box>
    );
};

export { Bekreftelse };
