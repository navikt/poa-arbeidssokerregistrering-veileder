import { AggregertPeriode, lagHentTekstForSprak, Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Heading, BodyShort } from '@navikt/ds-react';

import { BekreftelseHistorikk } from './bekreftelse-historikk';
import { OpplysningerHistorikk } from './opplysninger-historikk';
import { prettyPrintDato, prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';
import { oversettSluttaarsak } from '../../lib/oversett-sluttaarsak';

export interface Historikk extends AggregertPeriode {
    sprak: Sprak;
}

const TEKSTER = {
    nb: {
        startet: 'Startet',
        avsluttet: 'Avsluttet',
        sluttarsak: 'Sluttårsak',
        periode: 'Periode',
        av: 'av',
        SLUTTBRUKER: 'bruker',
        SYSTEM: 'Nav',
        VEILEDER: 'veileder',
        'fortsatt aktiv': 'fortsatt aktiv',
        'graceperiode utløpt': 'Ikke bekreftet arbeidssøkerstatus',
        'stopp av periode': 'Arbeidssøkerperioden er avsluttet av veileder',
        feilregistrering: 'Slettet på grunn av feilregistrering',
        "svarte nei på spørsmål 'vil du fortsatt være registrert som arbeidssøker?'": 'Stoppet av bruker',
        'personen er ikke bosatt etter folkeregisterloven':
            'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        'avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven':
            'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        'er registrert som død, avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven':
            'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        'personen er doed': 'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        'er registrert som død': 'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
        iserv: 'Arbeidssøkerperioden er avsluttet i Arena',
        overføring: 'Arbeidssøkerperioden er avsluttet i Arena',
        'har ugyldig/annullert identitet, kunne ikke fastslå alder, avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven':
            'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
    },
};

export function HistorikkWrapper(props: Historikk) {
    const { startet, avsluttet, bekreftelser, opplysningerOmArbeidssoeker, sprak } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);
    const sluttaarsak = oversettSluttaarsak(sprak);
    const startTidspunkt = startet.tidspunktFraKilde?.tidspunkt ?? startet.tidspunkt;
    return (
        <>
            <Heading level="2" size="large">
                {prettyPrintDato(startTidspunkt, sprak, true)} -{' '}
                {avsluttet && avsluttet.tidspunkt
                    ? prettyPrintDato(avsluttet.tidspunkt, sprak, true)
                    : tekst('fortsatt aktiv')}
            </Heading>
            <Heading level="3" size="small" className="mt-4">
                {tekst('periode')}
            </Heading>
            <div className="grid grid-cols-3 gap-x-2">
                <div className="font-semibold">{tekst('startet')}</div>
                <div>{prettyPrintDatoOgKlokkeslett(startTidspunkt, sprak, true)}</div>
                <div>
                    {tekst('av')} {tekst(startet.utfoertAv.type)}{' '}
                    {startet.utfoertAv.type === 'VEILEDER' ? `(${startet.utfoertAv.id})` : ''}
                </div>
                <div className="font-semibold">{tekst('avsluttet')}</div>
                {avsluttet && avsluttet.tidspunkt ? (
                    <>
                        <div>{prettyPrintDatoOgKlokkeslett(avsluttet.tidspunkt, sprak, true)}</div>
                        <div>
                            {tekst('av')} {tekst(avsluttet.utfoertAv.type)}{' '}
                            {avsluttet.utfoertAv.type === 'VEILEDER' ? `(${avsluttet.utfoertAv.id})` : ''}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-span-2">{tekst('fortsatt aktiv')}</div>
                    </>
                )}
            </div>
            <div className={'print:hidden'}>
                <Heading level="3" size="small" className="mt-4">
                    {tekst('sluttarsak')}
                </Heading>
                <BodyShort>{sluttaarsak(avsluttet?.aarsak ?? 'fortsatt aktiv')}</BodyShort>
            </div>
            <BekreftelseHistorikk bekreftelser={bekreftelser} sprak={sprak} />
            <OpplysningerHistorikk
                opplysningerOmArbeidssoker={opplysningerOmArbeidssoeker}
                sprak={sprak}
                className={'mt-4 print:hidden'}
            />
        </>
    );
}
