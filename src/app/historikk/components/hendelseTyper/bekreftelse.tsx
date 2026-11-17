import type { BekreftelseHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyShort, VStack } from '@navikt/ds-react';
import type React from 'react';
import { ReadMoreWrapper } from '@/app/historikk/components/hendelseTyper/read-more-wrapper';
import { prettyPrintDato } from '@/lib/date-utils';

type SporsmalSvar = {
    sporsmal: string;
    svar: string;
};

function mapBekreftelse(bekreftelse: BekreftelseHendelse): SporsmalSvar[] {
    if (!bekreftelse?.svar) {
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
    bekreftelse: BekreftelseHendelse;
};

const Bekreftelse: React.FC<BekreftelseProps> = (props) => {
    const { bekreftelse } = props;
    const bekreftelseMappet = mapBekreftelse(bekreftelse);

    return (
        <ReadMoreWrapper header='Se bekreftede opplysninger'>
            <BodyShort as='div' size='small'>
                <VStack gap='space-8'>
                    {bekreftelseMappet.map((field) => (
                        <div key={field.sporsmal}>
                            <strong>{field.sporsmal}</strong>
                            <br />
                            {field.svar}
                        </div>
                    ))}
                </VStack>
            </BodyShort>
        </ReadMoreWrapper>
    );
};

export { Bekreftelse };
