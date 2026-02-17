import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Hendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { TableDataCell, TableRow } from '@navikt/ds-react/Table';
import { prettyPrintDatoOgKlokkeslettKortform } from '@/lib/date-utils';

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
		SLETTET: 'Slettet på grunn av feilregistrering',
		FRISKMELDT_TIL_ARBEIDSFORMIDLING: 'Sykepenger',
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
		ISERV: 'Perioden avsluttet i Arena',
		overføring: 'Arbeidssøkerperioden er avsluttet i Arena',
		'har ugyldig/annullert identitet, kunne ikke fastslå alder, avvist fordi personen ikke er bosatt i Norge i henhold til folkeregisterloven':
			'Personen oppfyller ikke lenger kravene til å være registrert arbeidssøker',
		PERIODE_STARTET_V1: 'Periode startet',
		PERIODE_AVSLUTTET_V1: 'Periode avsluttet',
		OPPLYSNINGER_V4: 'Opplysninger sendt',
		PROFILERING_V1: 'Profilering ferdig',
		EGENVURDERING_V1: 'Egenvurdering sendt',
		BEKREFTELSE_V1: 'Periode bekreftet',
		PAA_VEGNE_AV_START_V1: 'På vegne av startet',
		PAA_VEGNE_AV_STOPP_V1: 'På vegne av stoppet',
		ARBEIDSSOEKERREGISTERET: 'Arbeidssøkerregisteret',
	},
};

function hentUtfoertAv(hendelse: Hendelse) {
	if (hendelse.type === 'PAA_VEGNE_AV_STOPP_V1' || hendelse.type === 'PAA_VEGNE_AV_START_V1') {
		return hendelse.bekreftelsesloesning;
	}
	if (hendelse.type === 'BEKREFTELSE_V1') {
		return `${hendelse.svar.sendtInnAv.utfoertAv.type} / ${hendelse.bekreftelsesloesning}`;
	} else {
		return `${hendelse.sendtInnAv.utfoertAv.type}`;
	}
}

function hentMetaData(hendelse: Hendelse) {
	if (hendelse.type === 'PERIODE_AVSLUTTET_V1' && ['ISERV', 'iserv'].includes(hendelse.sendtInnAv.aarsak || '')) {
		return 'ISERV';
	}
	if (hendelse.type === 'PERIODE_AVSLUTTET_V1' && ['Feilregistrering'].includes(hendelse.sendtInnAv.aarsak || '')) {
		return 'SLETTET';
	}
	if (
		hendelse.type === 'PERIODE_AVSLUTTET_V1' &&
		['[Bekreftelse:ytelse/støtte] Ikke levert innen fristen', '[Bekreftelse] ikke levert innen fristen'].includes(
			hendelse.sendtInnAv.aarsak || '',
		)
	) {
		return 'FRIST_BRUTT';
	}
	if (hendelse.type === 'PAA_VEGNE_AV_STOPP_V1' && hendelse.fristBrutt) {
		return 'FRIST_BRUTT';
	}
	if (hendelse.type === 'PROFILERING_V1') {
		return `${hendelse.profilertTil}`;
	}
	if (hendelse.type === 'BEKREFTELSE_V1') {
		return `${hendelse.status}`;
	}
	if (hendelse.type === 'EGENVURDERING_V1') {
		return `${hendelse.egenvurdering}`;
	}
	return '';
}

export function HendelseVisning(props: { hendelse: Hendelse }) {
	const { hendelse } = props;
	const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
	const kilde = hentUtfoertAv(hendelse);
	const status = hentMetaData(hendelse);
	const visVarseltrekant =
		(hendelse.type === 'PERIODE_AVSLUTTET_V1' && kilde === 'SYSTEM') ||
		(hendelse.type === 'BEKREFTELSE_V1' && status !== 'GYLDIG') ||
		(hendelse.type === 'PAA_VEGNE_AV_STOPP_V1' && status === 'FRIST_BRUTT');
	return (
		<TableRow className='odd:bg-ax-accent-200 hover:bg-ax-accent-400'>
			<TableDataCell>{prettyPrintDatoOgKlokkeslettKortform(hendelse.tidspunkt, 'nb', true)}</TableDataCell>
			<TableDataCell>{tekst(hendelse.type) ?? '--'}</TableDataCell>
			<TableDataCell>{tekst(kilde) ?? '--'}</TableDataCell>
			<TableDataCell>
				<div className='flex gap-4 items-center'>
					{tekst(status) ?? '--'}
					{visVarseltrekant && <ExclamationmarkTriangleFillIcon color='orange' className='mt-1 mr-4' />}
				</div>
			</TableDataCell>
		</TableRow>
	);
}
