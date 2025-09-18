import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { Tag } from '@navikt/ds-react';
import React from 'react';
import { TEKSTER } from '../tidslinjer/text';

type SourceProps = {
    source: string;
};

const Source: React.FC<SourceProps> = (props) => {
    const { source } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <Tag size="small" variant="info" className="sm:ml-auto">
            <span>{'Kilde: '}</span>
            <span>{tekst(source)}</span>
        </Tag>
    );
};

export { Source };
