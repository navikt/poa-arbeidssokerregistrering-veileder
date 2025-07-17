import { BodyShort, Box, Heading } from '@navikt/ds-react';
import { prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';
import { ProfileringMedEgenvurdering } from '@navikt/arbeidssokerregisteret-utils';

interface Props {
    egenvurderinger?: ProfileringMedEgenvurdering['egenvurderinger'];
}

function EgenvurderingerKomponent(props: Props) {
    const { egenvurderinger } = props;

    if (!egenvurderinger || egenvurderinger.length === 0) {
        return null;
    }
    return (
        <Box>
            <Heading size="small" level="3">
                Egenvurderinger
            </Heading>
            <hr className="mb-5" />
            {egenvurderinger.map((egenvurdering) => {
                return (
                    <div key={egenvurdering.egenvurderingId}>
                        <BodyShort className="mb-5">
                            <strong>Egenvurdert til</strong>
                            <br />
                            <span className="block first-letter:uppercase">
                                {egenvurdering.egenvurdering.split('_').join(' ').toLowerCase()}
                            </span>
                            <span className={'text-sm'}>
                                {prettyPrintDatoOgKlokkeslett(egenvurdering.sendtInnAv.tidspunkt)}
                            </span>
                        </BodyShort>
                    </div>
                );
            })}
        </Box>
    );
}

export default EgenvurderingerKomponent;
