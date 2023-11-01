import {
  DinSituasjon,
  hentTekst,
  JaEllerNei,
  SisteStillingValg,
  SporsmalId,
  Svar,
  UtdanningGodkjentValg,
  Utdanningsnivaa,
} from '../model/sporsmal';
import { Side, SisteJobb, SkjemaState } from '../model/skjema';
import { RegistreringState } from '../model/registrering';

export const aldriJobbet: SisteJobb = {
  label: 'X',
  konseptId: -1,
  styrk08: 'X',
};

type TeksterForBesvarelse = { sporsmalId: SporsmalId; sporsmal: string; svar: string }[];

type Payload = {
  besvarelse: Record<keyof RegistreringState, Svar | undefined>;
  sisteStilling: SisteJobb;
  teksterForBesvarelse: TeksterForBesvarelse;
};

function byggRegistrerArbeidssokerPayload(registreringState: RegistreringState) {
  const initialState: RegistreringState = {
      dinSituasjon: undefined,
      utdanning: Utdanningsnivaa.INGEN_SVAR,
      utdanningGodkjent: UtdanningGodkjentValg.INGEN_SVAR,
      utdanningBestatt: JaEllerNei.INGEN_SVAR,
      andreForhold: JaEllerNei.INGEN_SVAR,
      sisteStilling: SisteStillingValg.INGEN_SVAR,
      helseHinder: JaEllerNei.INGEN_SVAR,
  };

  const harAldriJobbet =
      registreringState.dinSituasjon === DinSituasjon.ALDRI_HATT_JOBB ||
      registreringState.sisteStilling === SisteStillingValg.HAR_IKKE_HATT_JOBB;

  const hentTekstForSisteStilling = () => {
      return harAldriJobbet ? 'Ingen yrkeserfaring' : registreringState.sisteJobb?.label || 'Ikke oppgitt';
  };

  let payload = (Object.keys(initialState) as Array<keyof RegistreringState>).reduce(
      (resultat: Payload, key) => {
          const svar = registreringState[key] || initialState[key];

          resultat.besvarelse[key] = svar;
          if (svar) {
              resultat.teksterForBesvarelse.push({
                  sporsmalId: key,
                  sporsmal: hentTekst('nb', key),
                  svar:
                      key === SporsmalId.sisteStilling
                          ? hentTekstForSisteStilling()
                          : hentTekst('nb', svar.toString()),
              });
          }
          return resultat;
      },
      { besvarelse: {}, teksterForBesvarelse: [] as TeksterForBesvarelse } as Payload
  );

  const sisteStilling = harAldriJobbet ? aldriJobbet : registreringState.sisteJobb;

  if (sisteStilling) {
      payload = {
          ...payload,
          sisteStilling: sisteStilling,
      };
  }
  return payload;
}

export default byggRegistrerArbeidssokerPayload;
