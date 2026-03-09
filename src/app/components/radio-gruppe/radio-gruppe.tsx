import { lagHentTekstForSprak, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Radio, RadioGroup } from '@navikt/ds-react';

interface RadioGruppeProps {
    valg: {
        tekst: string;
        value: string;
    }[];
    onSelect?: (val: any) => void;
    valgt?: string;
    visFeilmelding?: boolean;
    legend?: string;
    beskrivelse?: string;
}

const TEKSTER: Tekster<string> = {
    nb: {
        advarsel: 'Du må svare på spørsmålet før du kan registrere arbeidssøkeren.',
    },
    en: {
        advarsel: 'You will need to answer before you can register the job seeker.',
    },
};

function RadioGruppe(props: RadioGruppeProps) {
    const { valg, onSelect, valgt, visFeilmelding, legend, beskrivelse } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const error = visFeilmelding ? tekst('advarsel') : undefined;
    return (
        <RadioGroup value={valgt ?? null} legend={legend} onChange={onSelect} error={error} description={beskrivelse}>
            {valg.map((alternativ) => {
                return (
                    <Radio key={alternativ.value} value={alternativ.value}>
                        {alternativ.tekst}
                    </Radio>
                );
            })}
        </RadioGroup>
    );
}

export { RadioGruppe };
