'use client';

import { Alert, BodyLong, Box, CopyButton, Heading, Link, List, ReadMore } from '@navikt/ds-react';
import { loggAktivitet } from '@/lib/tracking';
import type { KanStartePeriodeFeil } from '@/model/kan-starte-periode';
import type { AvvisningKlassifisering } from './klassifiserAvvisning';

interface KopierTraceIdProps {
    traceId?: string;
}

function KopierTraceId({ traceId }: KopierTraceIdProps) {
    if (!traceId) return null;

    return (
        <Box className='mt-4'>
            Dersom du kontakter brukerstøtte blir det lettere for oss å hjelpe deg hvis du legger ved sporingsID-en
            under. Du kopierer den ved å trykke på knappen.
            <CopyButton copyText={traceId} text={traceId} activeText='Kopierte traceId' />
        </Box>
    );
}

function Under18Melding() {
    const gaarTilServicerutine = () => {
        loggAktivitet({ aktivitet: 'Går til servicerutine for samtykke for personer under 18' });
    };

    return (
        <Alert variant='warning' className='mb-8'>
            <Heading level='2' size='small' className='mb-4'>
                Denne personen er under 18 år og trenger samtykke fra foresatte for å kunne registrere seg som
                arbeidssøker.
            </Heading>
            <BodyLong spacing>
                Det du må gjøre videre er beskrevet i &nbsp;
                <Link
                    href='https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Servicerutine-for-innhenting-av-samtykke-fra-foresatte-for-unge-under-18-%C3%A5r-ved-registrering-som-arbeidss%C3%B8ker,.aspx'
                    onClick={gaarTilServicerutine}
                >
                    Servicerutine samtykke fra foresatte til unge under 18 år.
                </Link>
            </BodyLong>
            <BodyLong spacing>
                Du kan bare gå videre med registrering av denne personen hvis samtykke er innhentet.
            </BodyLong>
        </Alert>
    );
}

interface KanRegistreresSomArbeidssoekerSjekkProps {
    feilmelding: KanStartePeriodeFeil;
    klassifisering: AvvisningKlassifisering;
}

/**
 * Hovedvarsel som viser årsaken til avvisningen.
 *
 * - `UNDER_18_AAR` → spesialmelding med lenke til servicerutine.
 * - Harde regler eller manglende tilgang → "Du kan ikke registrere…"
 * - Kun myke regler → "Personen må registreres av en veileder etter at en vurdering er gjort"
 *
 * Ren presentasjonskomponent — all klassifiseringslogikk kommer fra `klassifisering`-propen.
 */
function KanRegistreresSomArbeidssoekerSjekk({
    feilmelding,
    klassifisering,
}: KanRegistreresSomArbeidssoekerSjekkProps) {
    const { erUnder18Aar, ansattManglerTilgang, kanAlleReglerOverstyres } = klassifisering;
    const { aarsakTilAvvisning } = feilmelding;
    const regler = aarsakTilAvvisning?.regler ?? [];

    if (erUnder18Aar) return <Under18Melding />;

    return (
        <Alert variant='warning' className='mb-8'>
            <Heading level='2' size='small' className='mb-4'>
                {ansattManglerTilgang || !kanAlleReglerOverstyres
                    ? 'Du kan ikke registrere denne personen som arbeidssøker'
                    : 'Personen må registreres av en veileder etter at en vurdering er gjort'}
            </Heading>
            {regler.length > 0 && (
                <Box marginBlock='space-16' asChild>
                    <List data-aksel-migrated-v8 as='ul'>
                        {regler.map((regel) => (
                            <List.Item key={regel.id}>{regel.beskrivelse}</List.Item>
                        ))}
                    </List>
                </Box>
            )}
            <ReadMore header='Mener du dette er feil?'>
                <KopierTraceId traceId={(feilmelding as KanStartePeriodeFeil & { traceId?: string }).traceId} />
            </ReadMore>
        </Alert>
    );
}

export default KanRegistreresSomArbeidssoekerSjekk;
