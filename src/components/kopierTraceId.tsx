import { Box, CopyButton } from '@navikt/ds-react';

interface TraceIdProps {
    traceId: string;
}

const KopierTraceId = (props: TraceIdProps) => {
    const { traceId } = props;

    return (
        <Box className="mt-4">
            Dersom du kontakter brukerstøtte blir det lettere for oss å hjelpe deg hvis du legger ved sporingsID-en
            under. Du kopierer den ved å trykke på knappen.
            <CopyButton copyText={traceId} text={traceId} activeText="Kopierte traceId" />
        </Box>
    );
};
export default KopierTraceId;
