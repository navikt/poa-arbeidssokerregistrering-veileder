export type Hendelse = {
    hendelseType: string;
    tidspunkt: string;
    [index: string]: any;
};

export type Tidslinje = {
    periodeId: string;
    identitetsnummer: string;
    startet: string;
    avsluttet: string;
    hendelser: Hendelse[];
};

export interface TidslinjerResponse {
    tidslinjer: Tidslinje[];
}
