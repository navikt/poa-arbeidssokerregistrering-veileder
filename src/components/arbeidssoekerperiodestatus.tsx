import { BodyLong, Box, Heading, ReadMore } from '@navikt/ds-react';
import { ArbeidssokerPeriode } from '@navikt/arbeidssokerregisteret-utils';

import { formaterDato } from '../lib/date-utils';
import { ArbeidssokerperioderResponse } from '@navikt/arbeidssokerregisteret-utils/dist/models/arbeidssokerperiode';
import { sorterEtterSistAvsluttedePeriode } from '../lib/sorter-etter-sist-avsluttede-periode';
import { useState } from 'react';
import { loggAktivitet } from '../lib/amplitude';

interface ArbeidssoekerperiodeStatusProps {
    perioder: ArbeidssokerperioderResponse;
    sisteArbeidssoekerperiode: ArbeidssokerPeriode;
}

function AllePerioderReadMore({ perioder }: { perioder: ArbeidssokerperioderResponse }) {
    const visHistorikk = perioder.length > 1;
    const [harKlikket, settHarKlikket] = useState<boolean>(false);

    const onClick = () => {
        if (!harKlikket) {
            loggAktivitet({ aktivitet: 'Klikker på "Se alle arbeidssøkerperioder bruker har hatt"' });
            settHarKlikket(true);
        }
    };

    if (!visHistorikk) {
        return null;
    }

    return (
        <ReadMore header={'Se alle arbeidssøkerperioder bruker har hatt'} onClick={onClick}>
            <ul>
                {perioder.sort(sorterEtterSistAvsluttedePeriode).map((periode) => {
                    const key = `${periode.startet.tidspunkt}-${periode.avsluttet?.tidspunkt}`;
                    const aktivPeriode = periode?.avsluttet === null;
                    return aktivPeriode ? (
                        <li key={key}>Fra {formaterDato(periode.startet.tidspunkt)} (aktiv periode)</li>
                    ) : (
                        <li key={key}>
                            Fra {formaterDato(periode.startet.tidspunkt)} {' til '}
                            {formaterDato(periode.avsluttet.tidspunkt)}
                        </li>
                    );
                })}
            </ul>
        </ReadMore>
    );
}

function ArbeidssoekerperiodeHistorikk(props: ArbeidssoekerperiodeStatusProps) {
    const { perioder, sisteArbeidssoekerperiode } = props;
    const harAktivPeriode = sisteArbeidssoekerperiode?.avsluttet === null;
    const harTidligereArbeidssoekerperiode = sisteArbeidssoekerperiode?.startet;

    if (!harTidligereArbeidssoekerperiode) {
        return <BodyLong>Personen har ingen tidligere arbeidssøkerperioder</BodyLong>;
    }

    if (harAktivPeriode) {
        return (
            <Box>
                <BodyLong>
                    Arbeidssøkerperioden startet {formaterDato(sisteArbeidssoekerperiode.startet.tidspunkt)}
                </BodyLong>
                <ReadMore header="Avslutte arbeidssøkerperioden?">
                    <BodyLong spacing>
                        For å avslutte arbeidssøkerperioden må du be bruker om å svare nei i meldekortet på spørsmål om
                        de ønsker å fortsatt stå registrert som arbeidssøker.
                    </BodyLong>
                    <BodyLong spacing>
                        Dersom det haster er det også mulig å endre formidlingsgruppen i Arena til ISERV ved å velge
                        oppgavetypen Inaktivering av person.
                    </BodyLong>
                </ReadMore>
                <AllePerioderReadMore perioder={perioder} />
            </Box>
        );
    }

    return (
        <BodyLong>
            Siste arbeidssøkerperiode var {formaterDato(sisteArbeidssoekerperiode.startet.tidspunkt)} -{' '}
            {formaterDato(sisteArbeidssoekerperiode.avsluttet.tidspunkt)}
            <AllePerioderReadMore perioder={perioder} />
        </BodyLong>
    );
}

function ArbeidssoekerperiodeStatus(props: ArbeidssoekerperiodeStatusProps) {
    const { perioder = [], sisteArbeidssoekerperiode } = props || {};

    const harAktivPeriode = sisteArbeidssoekerperiode?.avsluttet === null;

    const statusTekst = harAktivPeriode
        ? 'Personen er registrert som arbeidssøker'
        : 'Personen er ikke registrert som arbeidssøker';

    return (
        <Box>
            <Heading level="1" size="small">
                Arbeidssøkerstatus
            </Heading>
            <BodyLong>{statusTekst}</BodyLong>
            <ArbeidssoekerperiodeHistorikk sisteArbeidssoekerperiode={sisteArbeidssoekerperiode} perioder={perioder} />
        </Box>
    );
}

export default ArbeidssoekerperiodeStatus;
