import { Alert, Heading, ReadMore, List, BodyLong, Link } from '@navikt/ds-react';
import KopierTraceId from './kopierTraceId';
import { REGLER_SOM_IKKE_KAN_OVERSTYRES } from '../model/regler-for-avvisning';
import { loggAktivitet } from '../lib/tracking';

const Under18Melding: React.FC = () => {
    const gaarTilServicerutine = () => {
        loggAktivitet({ aktivitet: 'Går til servicerutine for samtykke for personer under 18' });
    };

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small" className="mb-4">
                Denne personen er under 18 år og trenger samtykke fra foresatte for å kunne registrere seg som
                arbeidssøker.
            </Heading>
            <BodyLong spacing>
                Det du må gjøre videre er beskrevet i &nbsp;
                <Link
                    href="https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Servicerutine-for-innhenting-av-samtykke-fra-foresatte-for-unge-under-18-%C3%A5r-ved-registrering-som-arbeidss%C3%B8ker,.aspx"
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
};

interface FeilmeldingProps {
    feilmelding?: any;
}

function Feilmelding(props: FeilmeldingProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const { feilKode } = feilmelding || {};

    if (!feilmelding) return null;

    const aarsaker = aarsakTilAvvisning?.regler ? aarsakTilAvvisning.regler.map((regel) => regel.id) : [];
    const reglerSomIkkeKanOverstyres = aarsaker.filter((regel) => REGLER_SOM_IKKE_KAN_OVERSTYRES.includes(regel));
    const duManglerTilgang = aarsaker.includes('ANSATT_IKKE_TILGANG_TIL_BRUKER') || feilKode === 'IKKE_TILGANG';
    const inneholderReglerSomIkkeKanOverstyres = reglerSomIkkeKanOverstyres.length > 0;
    const erUnder18Aar = aarsaker.includes('UNDER_18_AAR');

    if (erUnder18Aar) return <Under18Melding />;

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small" className="mb-4">
                {duManglerTilgang || inneholderReglerSomIkkeKanOverstyres
                    ? 'Du kan ikke registrere denne personen som arbeidssøker'
                    : 'Personen må registreres av en veileder etter at en vurdering er gjort'}
            </Heading>
            {aarsakTilAvvisning && aarsaker && (
                <List as="ul">
                    {aarsakTilAvvisning.regler.map((regel) => (
                        <List.Item key={regel.id}>{regel.beskrivelse}</List.Item>
                    ))}
                </List>
            )}
            <ReadMore header="Mener du dette er feil?">
                <KopierTraceId traceId={feilmelding.traceId} />
            </ReadMore>
        </Alert>
    );
}

interface KanRegistreresProps {
    feilmelding?: any;
    kanStarteArbeidssoekerperiode: boolean;
}

function KanRegistreresSomArbeidssoeker(props: KanRegistreresProps) {
    const { feilmelding, kanStarteArbeidssoekerperiode } = props;

    if (kanStarteArbeidssoekerperiode) return null;

    return <Feilmelding feilmelding={feilmelding} />;
}

export default KanRegistreresSomArbeidssoeker;
