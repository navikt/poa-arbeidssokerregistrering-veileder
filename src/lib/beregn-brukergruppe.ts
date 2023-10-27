import { Brukergruppe, Servicegruppe } from '../model/registrering';

function beregnBrukergruppe(servicegruppe: Servicegruppe, alder: number): Brukergruppe {
    const forsterketUngdomsinnsats = alder < 30;
    const over59 = alder > 59;

    switch (servicegruppe) {
        case (servicegruppe = Servicegruppe.IKVAL): {
            return forsterketUngdomsinnsats
                ? Brukergruppe.STANDARD_OG_UNGDOMSINNSATS
                : over59
                ? Brukergruppe.STANDARD_OG_OVER_59
                : Brukergruppe.STANDARD;
        }
        case (servicegruppe = Servicegruppe.BFORM): {
            return Brukergruppe.SITUASJONSBESTEMT;
        }
        case (servicegruppe = Servicegruppe.BKART): {
            return Brukergruppe.BEHOV_FOR_ARBEIDSEVNEVURDERING;
        }
        case (servicegruppe = Servicegruppe.IVURD): {
            return Brukergruppe.IKKE_VURDERT;
        }
        default: {
            return Brukergruppe.UKJENT;
        }
    }
}

export default beregnBrukergruppe;
