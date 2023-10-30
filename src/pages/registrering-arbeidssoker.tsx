import { Heading } from "@navikt/ds-react"

import DinSituasjon from "../components/skjema/din-situasjon"
import SisteJobb from "../components/skjema/siste-jobb/siste-jobb"
import UtdanningsNiva from "../components/skjema/utdanning"
import UtdanningGodkjent from "../components/skjema/utdanning-godkjent"
import UtdanningBestatt from "../components/skjema/utdanning-bestatt"
import Helseproblemer from "../components/skjema/helseproblemer"
import AndreProblemer from "../components/skjema/andre-problemer"


export default function RegistreringArbeidssoker() {
  return (
    <section className="flex flex-col items-center p-8">
      <main className="flex flex-col max-w-4xl w-full" tabIndex={-1} id="maincontent">
        <Heading size="medium" level="1" className="mb-2">
          Arbeidssøkerregistrering
        </Heading>
        <DinSituasjon />
        <SisteJobb />
        <UtdanningsNiva />
        <UtdanningGodkjent />
        <UtdanningBestatt />
        <Helseproblemer />
        <AndreProblemer />
      </main>
    </section>
  )
}
