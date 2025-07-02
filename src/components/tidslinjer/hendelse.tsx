import { Box } from '@navikt/ds-react';
import { lagHentTekstForSprak, Sprak } from '@navikt/arbeidssokerregisteret-utils';

import { prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';

import { Hendelse } from '../../model/tidslinjer';

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
        DAGPENGER: 'Dagpenger',
        periode_startet_v1: 'Arbeidssøkerperiode startet',
        opplysninger_v4: 'Opplysninger sendt inn',
        profilering_v1: 'Profilering ferdig',
        bekreftelse_v1: 'Arbeidssøkerperiode bekreftet',
        periode_avsluttet_v1: 'Arbeidssøkerperiode avsluttet',
        pa_vegne_av_stopp_v1: 'Bekreftelse på vegne av stoppet',
        pa_vegne_av_start_v1: 'Bekreftelse på vegne av startet',
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

function snakeToCamel(snakeCaseString) {
    return snakeCaseString.replace(/_([a-z])/g, (match, char) => char.toUpperCase());
}

function hentUtfoertAv(data) {
    const utfoerer = data.bekreftelsesloesning
        ? { type: data.bekreftelsesloesning }
        : data.bekreftelse
          ? data.bekreftelse.svar.sendtInnAv.utfoertAv
          : data.sendtInnAv
            ? data.sendtInnAv.utfoertAv
            : data.utfoertAv;
    return utfoerer.type;
}

function hentMetaData(data) {
    const metadata = data?.profilertTil || data?.status || '';
    return metadata;
}

export function HendelseVisning(props: Hendelse) {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { hendelseType, tidspunkt } = props;
    const data = props[snakeToCamel(hendelseType)];
    const utfoertAv = hentUtfoertAv(data);
    const metaData = hentMetaData(data);

    return (
        <Box>
            {tekst(hendelseType)} - {prettyPrintDatoOgKlokkeslett(tidspunkt, 'nb', true)} - {tekst(utfoertAv)}{' '}
            {metaData ? ` - ${metaData}` : ''}
        </Box>
    );
}
