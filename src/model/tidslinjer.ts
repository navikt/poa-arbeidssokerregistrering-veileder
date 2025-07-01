export type Tidslinje = {
    periodeId: string;
    identitetsnummer: string;
    startet: string;
    avsluttet: string;
    hendelser: any[];
};

export interface TidslinjerResponse {
    tidslinjer: Tidslinje[];
}
