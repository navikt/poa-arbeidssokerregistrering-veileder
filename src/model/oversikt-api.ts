import type { Bekreftelsesloesning, ProfilertTil } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type Periode = {
    id: string;
    startet: string;
    avsluttet?: string;
};

type SortOrder = 'ASC' | 'DESC';

export type TilknyttetKontor = {
    kontor_id: string;
    kontor_navn: string;
    kontor_type: string;
};

export type Arbeidssoker = {
    arbeidssoeker_id: number;
    identitetsnummer: string;
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    ledig_siden?: string;
    periode: Periode;
    opplysninger?: {
        id: string;
        tidspunkt: string;
    };
    profilering?: {
        id: string;
        profilert_til: ProfilertTil;
        tidspunkt: string;
    };
    egenvurdering?: {
        id: string;
        egenvurdert_til: ProfilertTil;
        tidspunkt: string;
    };
    bekreftelse?: {
        id: string;
        gjelder_fra: string;
        gjelder_til: string;
        har_jobbet: boolean;
        vil_fortsette: boolean;
        bekreftelsesloesning: Bekreftelsesloesning;
    };
    bekreftelse_paa_vegne_av: Bekreftelsesloesning[];
    tilknyttet_kontor: TilknyttetKontor[];
};

export type ApiPaging = {
    page: number;
    page_size: number;
    total_items: number;
    sort_order: SortOrder;
};

export type OversiktApiResponse = {
    arbeidssoekere: Arbeidssoker[];
    paging: ApiPaging;
};
