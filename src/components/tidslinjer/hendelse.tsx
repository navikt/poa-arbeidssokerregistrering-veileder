import { Box, HGrid } from '@navikt/ds-react';
import { lagHentTekstForSprak, Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import { prettyPrintDatoOgKlokkeslettKortform } from '../../lib/date-utils';

import { Hendelse } from '../../model/tidslinjer';

const TEKSTER = {
    nb: {
        startet: 'Startet',
        avsluttet: 'Avsluttet',
        sluttarsak: 'Sluttårsak',
        periode: 'Periode',
        av: 'av',
        SLUTTBRUKER: 'Bruker',
        SYSTEM: 'System',
        VEILEDER: 'Veileder',
        DAGPENGER: 'Dagpenger',
        FRIST_BRUTT: 'Meldeplikt brutt',
        'SLUTTBRUKER / ARBEIDSSOEKERREGISTERET': 'Bruker/Registeret',
        'SLUTTBRUKER / DAGPENGER': 'Bruker/Dagpenger',
        'SLUTTBRUKER / FRISKMELDT_TIL_ARBEIDSFORMIDLING': 'Bruker/Sykepenger',
        'VEILEDER / ARBEIDSSOEKERREGISTERET': 'Veileder/Registeret',
        'VEILEDER / DAGPENGER': 'Veileder/Dagpenger',
        'VEILEDER / FRISKMELDT_TIL_ARBEIDSFORMIDLING': 'Veileder/Sykepenger',
        periode_startet_v1: 'Periode startet',
        opplysninger_v4: 'Opplysninger sendt',
        profilering_v1: 'Profilering ferdig',
        bekreftelse_v1: 'Periode bekreftet',
        periode_avsluttet_v1: 'Periode avsluttet',
        pa_vegne_av_stopp_v1: 'På vegne av stoppet',
        pa_vegne_av_start_v1: 'På vegne av startet',
        GYLDIG: 'Gyldig',
        UVENTET_KILDE: 'Uventet kilde',
        UTENFOR_PERIODE: 'Utenfor periode',
        ANTATT_GODE_MULIGHETER: 'Gode muligheter',
        ANTATT_BEHOV_FOR_VEILEDNING: 'Behov for veiledning',
        OPPGITT_HINDRINGER: 'Oppgitt hindringer',
        UKJENT_VERDI: 'Ukjent verdi',
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
          ? { type: `${data.bekreftelse.svar.sendtInnAv.utfoertAv.type} / ${data.bekreftelse.bekreftelsesloesning}` }
          : data.sendtInnAv
            ? data.sendtInnAv.utfoertAv
            : data.utfoertAv;

    return utfoerer.type;
}

function hentMetaData(data) {
    if (
        data?.fristBrutt ||
        ['[Bekreftelse:ytelse/støtte] Ikke levert innen fristen', '[Bekreftelse] ikke levert innen fristen'].includes(
            data?.aarsak,
        )
    ) {
        return 'FRIST_BRUTT';
    }
    const metadata = data?.profilertTil || data?.status || '';
    return metadata;
}

export function HendelseVisning(props: Hendelse) {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { hendelseType, tidspunkt } = props;
    const data = props[snakeToCamel(hendelseType)];
    const kilde = hentUtfoertAv(data);
    const status = hentMetaData(data);
    const visVarseltrekant =
        (hendelseType === 'periode_avsluttet_v1' && kilde === 'SYSTEM') ||
        (hendelseType === 'bekreftelse_v1' && status !== 'GYLDIG') ||
        (hendelseType === 'pa_vegne_av_stopp_v1' && status === 'FRIST_BRUTT');

    return (
        <Box>
            <HGrid gap={'4'} columns={4}>
                <span>{prettyPrintDatoOgKlokkeslettKortform(tidspunkt, 'nb', true)}</span>
                <span>{tekst(hendelseType)}</span>
                <span>{tekst(kilde)}</span>
                <span className="flex flex-row justify-between">
                    {tekst(status)}
                    {visVarseltrekant && <ExclamationmarkTriangleFillIcon color="orange" className="mt-1 mr-4" />}
                </span>
            </HGrid>
        </Box>
    );
}
