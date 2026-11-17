import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { Box, Tag } from '@navikt/ds-react';
import { TEKSTER } from '@/app/historikk/components/text';

type SourceProps = {
    source: string;
};

const Source: React.FC<SourceProps> = (props) => {
    const { source } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <Box marginInline={{ sm: 'auto space-0' }}>
            <Tag size='small' variant='info'>
                <span>{'Kilde: '}</span>
                <span>{tekst(source)}</span>
            </Tag>
        </Box>
    );
};

export { Source };
