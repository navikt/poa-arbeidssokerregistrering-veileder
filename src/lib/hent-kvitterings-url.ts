import { Side } from '../model/skjema';

export default function hentKvitteringsUrl(side: Side = 'standard') {
    return side === 'sykmeldt' ? '/kvittering-sykmeldt/' : '/kvittering/';
}
