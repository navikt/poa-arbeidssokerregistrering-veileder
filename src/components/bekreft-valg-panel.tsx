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
        <Box paddingBlock="space-16 space-24">
            <Checkbox {...props}>{label}</Checkbox>
        </Box>
    );
}

export default BekreftValgPanel;
