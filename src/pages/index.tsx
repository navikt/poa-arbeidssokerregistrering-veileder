import { Heading } from "@navikt/ds-react"

export default function Home() {
  return (
    <section className="flex flex-col items-center p-8">
      <main className="flex flex-col max-w-4xl w-full" tabIndex={-1} id="maincontent">
        <Heading size="medium" level="1">
          Arbeidssøkerregistrering for veileder
        </Heading>
      </main>
    </section>
  )
}
