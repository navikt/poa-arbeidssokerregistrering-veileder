import { ArbeidssokerPeriode } from '@navikt/arbeidssokerregisteret-utils';

export function sorterEtterSistAvsluttedePeriode(a: ArbeidssokerPeriode, b: ArbeidssokerPeriode) {
    const aTime = a.avsluttet?.tidspunkt ? new Date(a.avsluttet!.tidspunkt).getTime() : new Date().getTime();
    const bTime = b.avsluttet?.tidspunkt ? new Date(b.avsluttet!.tidspunkt).getTime() : new Date().getTime();

    return bTime - aTime;
}
