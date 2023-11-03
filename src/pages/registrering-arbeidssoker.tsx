import { Heading } from "@navikt/ds-react"

import { RegistreringProvider } from "../contexts/registrering-context"

import DinSituasjon from "../components/skjema/din-situasjon"
import SisteJobb from "../components/skjema/siste-jobb/siste-jobb"
import UtdanningsNiva from "../components/skjema/utdanning"
import UtdanningGodkjent from "../components/skjema/utdanning-godkjent"
import UtdanningBestatt from "../components/skjema/utdanning-bestatt"
import Helseproblemer from "../components/skjema/helseproblemer"
import AndreProblemer from "../components/skjema/andre-problemer"
import { RegistrerArbeidssokerKnapp } from "../components/skjema/registrer-arbeidssoker-knapp"

export default function RegistreringArbeidssoker() {
  return (
    <>
      <Heading size="medium" level="1" className="mb-2">
        Arbeidssøkerregistrering
      </Heading>
      <RegistreringProvider>
        <DinSituasjon />
        <SisteJobb />
        <UtdanningsNiva />
        <UtdanningGodkjent />
        <UtdanningBestatt />
        <Helseproblemer />
        <AndreProblemer />
        <RegistrerArbeidssokerKnapp />
      </RegistreringProvider>
    </>
  )
}
