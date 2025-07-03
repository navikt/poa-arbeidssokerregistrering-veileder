import { Sprak } from '@navikt/arbeidssokerregisteret-utils';

const norsk = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
];
const monthNames = {
    nb: norsk,
    nn: norsk,
    pl: norsk,
    en: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
};

const prettyPrintDato = (dato: string, locale?: Sprak, visAar?: boolean) => {
    const now = new Date();
    const date = new Date(dato);
    const thisYear = now.getFullYear();
    const year = date.getFullYear();
    const valgtSprak = !locale ? 'nb' : (locale as Sprak);
    const month = monthNames[valgtSprak][date.getMonth()];

    if (valgtSprak === 'en') {
        return `${month} ${date.getDate()}.${visAar || thisYear !== year ? ' ' + year : ''}`;
    }

    return `${date.getDate()}. ${month}${visAar || thisYear !== year ? ' ' + year : ''}`;
};

function formaterDato(
    dateString: string | undefined,
    options: Intl.DateTimeFormatOptions = {
        // dateStyle: 'short',
        // timeStyle: 'long',
    },
): string {
    return dateString ? new Intl.DateTimeFormat('nb', options).format(new Date(dateString)) : 'Ingen tidspunkt funnet';
}

function prettyPrintDatoOgKlokkeslett(dato: string, locale?: Sprak, visAar?: boolean) {
    const now = new Date();
    const date = new Date(dato);
    const thisYear = now.getFullYear();
    const year = date.getFullYear();
    const timer = date.getHours();
    const minutter = date.getMinutes();
    const valgtSprak = !locale ? 'nb' : (locale as Sprak);
    const month = monthNames[valgtSprak][date.getMonth()];

    if (valgtSprak === 'en') {
        return `${month} ${date.getDate()}.${visAar || thisYear !== year ? ' ' + year : ''} at {timer.toString().length === 1 ? '0': ''}${timer}:${minutter.toString().length === 1 ? '0' : ''}${minutter}`;
    }

    return `${date.getDate()}. ${month}${visAar || thisYear !== year ? ' ' + year : ''} klokken ${timer.toString().length === 1 ? '0' : ''}${timer}:${minutter.toString().length === 1 ? '0' : ''}${minutter}`;
}

function prettyPrintDatoOgKlokkeslettKortform(dato: string, locale?: Sprak, visAar?: boolean) {
    const now = new Date();
    const date = new Date(dato);
    const thisYear = now.getFullYear();
    const year = date.getFullYear();
    const timer = date.getHours();
    const minutter = date.getMinutes();
    const valgtSprak = !locale ? 'nb' : (locale as Sprak);
    const month = monthNames[valgtSprak][date.getMonth()];

    if (valgtSprak === 'en') {
        return `${month} ${date.getDate()}.${visAar || thisYear !== year ? ' ' + year : ''} at {timer.toString().length === 1 ? '0': ''}${timer}:${minutter.toString().length === 1 ? '0' : ''}${minutter}`;
    }

    return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}${visAar || thisYear !== year ? '.' + year : ''} ${timer.toString().length === 1 ? '0' : ''}${timer}:${minutter.toString().length === 1 ? '0' : ''}${minutter}`;
}

export { prettyPrintDato, prettyPrintDatoOgKlokkeslett, prettyPrintDatoOgKlokkeslettKortform, formaterDato };
