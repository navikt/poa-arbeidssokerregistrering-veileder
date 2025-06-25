import React from 'react';
import { Checkbox, Box } from '@navikt/ds-react';

interface PanelProps {
    label: React.ReactNode;
    checked: boolean;
    onChange?: () => void;
    className?: string;
}

function BekreftValgPanel(props: PanelProps) {
    const { label } = props;

    return (
        <Box paddingBlock="4 8">
            <Checkbox {...props}>{label}</Checkbox>
        </Box>
    );
}

export default BekreftValgPanel;
