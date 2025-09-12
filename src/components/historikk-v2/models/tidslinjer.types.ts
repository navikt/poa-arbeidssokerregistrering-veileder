export type TidslinjerData = {
    tidslinjer: Tidslinje[];
};

export type Tidslinje = {
    periodeId: string;
    identitetsnummer: string;
    startet: string;
    hendelser: Hendelse[];
    avsluttet?: string;
};

export type Hendelse =
    | OpplysningerV4Hendelse
    | PeriodeStartetV1Hendelse
    | ProfileringV1Hendelse
    | PeriodeAvsluttetV1Hendelse
    | PaVegneAvStoppV1Hendelse
    | BekreftelseV1Hendelse;

export type BekreftelseV1Hendelse = {
    hendelseType: 'bekreftelse_v1';
    tidspunkt: string;
    periodeStartetV1: null;
    periodeAvsluttetV1: null;
    opplysningerV4: null;
    profileringV1: null;
    bekreftelseV1: {
        status: 'GYLDIG' | string;
        bekreftelse: {
            periodeId: string;
            bekreftelsesloesning: string;
            id: string;
            svar: {
                sendtInnAv: {
                    tidspunkt: string;
                    utfoertAv: {
                        type: string;
                        id: string;
                        sikkerhetsnivaa: string;
                    };
                    kilde: string;
                    aarsak: string;
                    tidspunktFraKilde: null;
                };
                gjelderFra: string;
                gjelderTil: string;
                harJobbetIDennePerioden: boolean;
                vilFortsetteSomArbeidssoeker: boolean;
            };
        };
    };
    paVegneAvStartV1: null;
    paVegneAvStoppV1: null;
};

export type OpplysningerV4Hendelse = {
    hendelseType: 'opplysninger_v4';
    tidspunkt: string;
    opplysningerV4: {
        id: string;
        periodeId: string;
        sendtInnAv: {
            tidspunkt: string;
            utfoertAv: {
                type: string;
                id: string;
                sikkerhetsnivaa?: string;
            };
            kilde: string;
            aarsak: string;
        };
        utdanning: {
            nus: string;
            bestaatt: string;
            godkjent: string;
        };
        helse: {
            helsetilstandHindrerArbeid: string;
        };
        jobbsituasjon: {
            beskrivelser: {
                beskrivelse: string;
                detaljer: {
                    stilling: string;
                    stilling_styrk08: string;
                };
            }[];
        };
        annet: {
            andreForholdHindrerArbeid: string;
        };
    };
};

export type PeriodeStartetV1Hendelse = {
    hendelseType: 'periode_startet_v1';
    tidspunkt: string;
    periodeStartetV1: {
        tidspunkt: string;
        utfoertAv: {
            type: string;
            id: string;
            sikkerhetsnivaa?: string;
        };
        kilde: string;
        aarsak: string;
    };
};

export type ProfileringV1Hendelse = {
    hendelseType: 'profilering_v1';
    tidspunkt: string;
    profileringV1: {
        id: string;
        periodeId: string;
        opplysningerOmArbeidssokerId: string;
        sendtInnAv: {
            tidspunkt: string;
            utfoertAv: {
                type: string;
                id: string;
            };
            kilde: string;
            aarsak: string;
            tidspunktFraKilde?: {
                tidspunkt: string;
                avviksType: string;
            };
        };
        profilertTil: string;
        jobbetSammenhengendeSeksAvTolvSisteMnd: boolean;
        alder: number;
    };
};

export type PeriodeAvsluttetV1Hendelse = {
    hendelseType: 'periode_avsluttet_v1';
    tidspunkt: string;
    periodeAvsluttetV1: {
        tidspunkt: string;
        utfoertAv: {
            type: string;
            id: string;
            sikkerhetsnivaa?: string;
        };
        kilde: string;
        aarsak: string;
        tidspunktFraKilde?: {
            tidspunkt: string;
            avviksType: string;
        };
    };
};

export type PaVegneAvStoppV1Hendelse = {
    hendelseType: 'pa_vegne_av_stopp_v1';
    tidspunkt: string;
    paVegneAvStoppV1: {
        periodeId: string;
        bekreftelsesloesning: string;
        fristBrutt: boolean;
    };
};
