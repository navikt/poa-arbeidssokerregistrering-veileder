import type { Bekreftelsesloesning, ProfilertTil } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

export type KartleggingPayload = {
    type: 'TILKNYTTET_KONTOR';
    kontorId: string;
    kontorType?: 'ARBEIDSOPPFOLGING';
    ledigSiden?: string;
    paging: {
        page: number;
        pageSize: number;
        sortOrder: 'DESC' | 'ASC';
    };
};

type Periode = {
    id: string;
    startet: string;
    avsluttet?: string;
};

type SortOrder = 'ASC' | 'DESC';

export type Kontortilknytning = {
    kontorId: string;
    kontorNavn: string;
    kontorType: string;
};

export type Ledighetsperiode = {
    ledigSiden?: string;
    periode: Periode;
    opplysninger?: {
        id: string;
        tidspunkt: string;
    };
    profilering?: {
        id: string;
        profilertTil: ProfilertTil;
        tidspunkt: string;
    };
    egenvurdering?: {
        id: string;
        egenvurdertTil: ProfilertTil;
        tidspunkt: string;
    };
    bekreftelse?: {
        id: string;
        gjelderFra: string;
        gjelderTil: string;
        harJobbet: boolean;
        vilFortsette: boolean;
        bekreftelsesloesning: Bekreftelsesloesning;
    };
    bekreftelsePaaVegneAv: Bekreftelsesloesning[];
};

export type Arbeidssoker = {
    arbeidssoekerId: number;
    identitetsnummer: string;
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    ledighetsperioder: Ledighetsperiode[];
    kontortilknytninger: Kontortilknytning[];
};

export type ApiPaging = {
    page: number;
    pageSize: number;
    hitSize: number;
    totalCount: number;
    sortOrder: SortOrder;
};

export type KartleggingApiResponse = {
    arbeidssoekere: Arbeidssoker[];
    paging: ApiPaging;
};
