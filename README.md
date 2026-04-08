# poa-arbeidssokerregistrering-veileder

Arbeidssøkerregistrering frontend for veileder (Modia - Arbeidssøkerregisteret).

## Utvikling

Bruk Node.js 24 `nvm use` (dersom du bruker nvm til versjonshåndtering av Node.js).

Siden noen av modulene hentes fra GitHubs package registry må du også gjøre litt ekstra konfigurasjon for å kjøre løsningen lokalt.

- Opprett et PAT (github => settings => developer settings => personal access tokens => tokens (classic)) med `read:packages` scope
- Konfigurer SSO mot NAVIKT for tokenet
- bruk tokenet som passord ved login `pnpm login --registry https://npm.pkg.github.com`

Deretter fortsette du med

```sh
git clone https://github.com/navikt/poa-arbeidssokerregistrering-veileder.git
cd poa-arbeidssokerregistrering-veileder
pnpm install
pnpm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Testing

Kjør alle tester med [Vitest](https://vitest.dev/):

```sh
pnpm test
```

For watch-modus under utvikling:

```sh
pnpm run test:watch
```

## Deploye kun til dev

Ved å prefikse branch-navn med `dev/`, så vil branchen kun deployes i dev.

```
git checkout -b dev/<navn på branch>
```

For å teste løsningen i dev bruker du [https://arbeidssokerregistrering-for-veileder.intern.dev.nav.no](https://arbeidssokerregistrering-for-veileder.intern.dev.nav.no)

Du vil trenger en veileder-testbruker for å logge inn.
Veilederbruker kan du opprette i IDA [https://ida.intern.nav.no](https://ida.intern.nav.no/)
Du må også opprette eller finne test-identer i Dolly [https://dolly.ekstern.dev.nav.no/](https://dolly.ekstern.dev.nav.no/)

## Hva gjør appen?

Appen gir en veileder mulighet til å administrere en persons arbeidssøkerstatus.

**Dersom personen ikke har en pågående periode, kan veileder:**

- Sjekke om personen kan registreres som arbeidssøker
- Registrere personen som arbeidssøker (fylle inn opplysninger)

**Dersom personen allerede har en pågående periode, kan veileder:**

- Se opplysninger og status for perioden
- Endre opplysninger for personen
- Bekrefte arbeidssøkerperioden på vegne av personen
- Se tidslinje og historikk for personen
- Avslutte perioden
- Slette perioden (kun ved feilregistrering)

---

## Ekstern dokumentasjon

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)
- [testing-library](https://testing-library.com/)
- [Biome](https://biomejs.dev/)
- [Aksel (NAV Designsystem)](https://aksel.nav.no/)

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles via issues her på github.

# For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-paw-dev](https://nav-it.slack.com/archives/CLTFAEW75)
