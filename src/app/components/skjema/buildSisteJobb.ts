import type { SisteJobb } from '@navikt/arbeidssokerregisteret-utils';
import type { BeskrivelseMedDetaljer } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import type { SisteArbeidsforholdResult } from '@/app/lib/api/aareg';

// Aareg er ferskeste kilde til «siste jobb» — overstyr snapshot hvis tilgjengelig
function buildSisteJobb(aaregResult?: SisteArbeidsforholdResult, snapshotJobb?: BeskrivelseMedDetaljer): SisteJobb {
    const sisteJobbFraAareg = aaregResult?.sisteArbeidsforhold;
    if (sisteJobbFraAareg) {
        return {
            label: sisteJobbFraAareg.label,
            styrk08: sisteJobbFraAareg.styrk08,
            konseptId: sisteJobbFraAareg.konseptId,
        };
    }
    if (snapshotJobb) {
        return {
            label: snapshotJobb.detaljer?.stilling ?? 'Annen stilling',
            styrk08: snapshotJobb.detaljer?.stilling_styrk08 ?? '-1',
            konseptId: -1,
        };
    }
    return {
        label: 'Annen stilling',
        styrk08: '-1',
        konseptId: -1,
    };
}

export { buildSisteJobb };
