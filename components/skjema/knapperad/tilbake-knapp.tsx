import { Button } from '@navikt/ds-react';

import skjemaStyles from '../../../styles/skjema.module.css';
import lagHentTekstForSprak, { Tekster } from '../../../lib/lag-hent-tekst-for-sprak';
import useSprak from '../../../hooks/useSprak';

const TEKSTER: Tekster<string> = {
    nb: {
        tilbake: 'Tilbake',
    },
    en: {
        tilbake: 'Back',
    },
};

export const TilbakeKnapp = (props: { onClick: () => void }) => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    return (
        <>
            <div className={skjemaStyles.taCenter}>
                <Button variant="secondary" onClick={props.onClick}>
                    {' '}
                    {tekst('tilbake')}{' '}
                </Button>
            </div>
        </>
    );
};
